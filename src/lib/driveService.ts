import { toast } from 'react-hot-toast';

export interface Book {
  id: string;
  name: string;
  color: string;
  icon: string; // emoji icon
  created_at: string;
  updated_at: string;
  entryCount?: number;
  totalIn?: number;
  totalOut?: number;
}

export interface Entry {
  id: string;
  type: 'in' | 'out';
  amount: number;
  remark: string;
  contact?: string;
  payment_mode: 'cash' | 'online' | 'cheque';
  category: string;
  timestamp: string; // Date or datetime selection
  created_at: string;
  attachmentUrl?: string; // Optional attached photo or file
}

const CLIENT_ID_KEY = 'choosify_cashbook_google_client_id';
const ACCESS_TOKEN_KEY = 'choosify_cashbook_google_access_token';

// Default Client ID for sandbox/developer configurations
const DEFAULT_CLIENT_ID = '375254134810-qgqq7eap0uocp4be60sh4k791gco1hmo.apps.googleusercontent.com';

class DriveServiceClass {
  private accessToken: string | null = null;
  private isGoogleConnected: boolean = false;

  // Cached Google Drive folder IDs
  private choosifyFolderId: string | null = null;
  private cashBookFolderId: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    this.isGoogleConnected = !!this.accessToken;
  }

  public getClientId(): string {
    return localStorage.getItem(CLIENT_ID_KEY) || DEFAULT_CLIENT_ID;
  }

  public setClientId(clientId: string) {
    if (!clientId.trim()) {
      localStorage.removeItem(CLIENT_ID_KEY);
    } else {
      localStorage.setItem(CLIENT_ID_KEY, clientId);
    }
  }

  public isConnected(): boolean {
    return this.isGoogleConnected;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      this.isGoogleConnected = true;
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      this.isGoogleConnected = false;
      this.choosifyFolderId = null;
      this.cashBookFolderId = null;
    }
  }

  // Trigger Google Drive Authorization (Implicit OAuth2 Flow)
  public authorize() {
    const clientId = this.getClientId();
    const redirectUri = window.location.origin + '/cashbook';
    const scope = 'https://www.googleapis.com/auth/drive.file';
    
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${encodeURIComponent(scope)}&prompt=consent`;

    // Open Google Sign-In in a popup or current tab
    window.location.href = oauthUrl;
  }

  // Process access_token from URL hash on callback
  public handleAuthCallback(): boolean {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get('access_token');
      if (token) {
        this.setAccessToken(token);
        // Clear hash from address bar for beauty
        window.history.replaceState(null, '', window.location.pathname);
        toast.success('Successfully connected to Google Drive!', { icon: '💾' });
        return true;
      }
    }
    return false;
  }

  public disconnect() {
    this.setAccessToken(null);
    toast.success('Disconnected Google Drive. Using local storage mode.');
  }

  // Fetch with Authorization headers
  private async googleFetch(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.accessToken) {
      throw new Error('Google Drive is not authenticated.');
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${this.accessToken}`);
    
    const res = await fetch(url, { ...options, headers });
    
    if (res.status === 401) {
      // Access token expired or invalid
      this.disconnect();
      throw new Error('Google authentication expired. Please reconnect.');
    }
    return res;
  }

  // Create or Find Folder in Google Drive
  private async findOrCreateFolder(name: string, parentId?: string): Promise<string> {
    let q = `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    if (parentId) {
      q += ` and '${parentId}' in parents`;
    }

    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)`;
    const searchRes = await this.googleFetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    // Otherwise create the folder
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const metadata: any = {
      name,
      mimeType: 'application/vnd.google-apps.folder'
    };
    if (parentId) {
      metadata.parents = [parentId];
    }

    const createRes = await this.googleFetch(createUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    });
    
    const createData = await createRes.json();
    if (!createRes.ok) {
      throw new Error(createData.error?.message || `Failed to create folder ${name}`);
    }
    return createData.id;
  }

  // Find or Create File
  private async findOrCreateFile(
    name: string, 
    parentId: string, 
    defaultContent: string,
    mimeType: string = 'application/json'
  ): Promise<{ id: string; content: string }> {
    const q = `name='${name}' and '${parentId}' in parents and trashed=false`;
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)`;
    const searchRes = await this.googleFetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.files && searchData.files.length > 0) {
      const fileId = searchData.files[0].id;
      // Read content
      const readUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const readRes = await this.googleFetch(readUrl);
      if (readRes.ok) {
        const text = await readRes.text();
        return { id: fileId, content: text };
      }
    }

    // Create File
    const metadata = {
      name,
      parents: [parentId],
      mimeType
    };

    // Multipart/Related upload
    const boundary = 'foo_bar_baz_boundary';
    const body = [
      `\r\n--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`,
      `\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n${defaultContent}`,
      `\r\n--${boundary}--`
    ].join('');

    const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    const createRes = await this.googleFetch(createUrl, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body
    });

    const createData = await createRes.json();
    if (!createRes.ok) {
      throw new Error(createData.error?.message || `Failed to create file ${name}`);
    }

    return { id: createData.id, content: defaultContent };
  }

  // Update File Content
  private async updateFileContent(fileId: string, content: string, mimeType: string = 'application/json'): Promise<void> {
    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
    const res = await this.googleFetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': mimeType
      },
      body: content
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error?.message || 'Failed to update file in Google Drive');
    }
  }

  // Initialize Drive Folder Structure
  public async initDriveStructure(): Promise<void> {
    if (!this.isConnected()) return;
    try {
      this.choosifyFolderId = await this.findOrCreateFolder('Choosify');
      this.cashBookFolderId = await this.findOrCreateFolder('CashBook', this.choosifyFolderId);
    } catch (e: any) {
      console.error('Error initializing drive structure:', e);
      toast.error(`Google Drive init failed: ${e.message}`);
    }
  }

  // === LOCAL DATA FALLBACK UTILS ===
  private getLocalBooks(): Book[] {
    const data = localStorage.getItem('choosify_cashbook_books');
    return data ? JSON.parse(data) : [];
  }

  private saveLocalBooks(books: Book[]) {
    localStorage.setItem('choosify_cashbook_books', JSON.stringify(books));
  }

  private getLocalEntries(bookId: string): Entry[] {
    const data = localStorage.getItem(`choosify_cashbook_entries_${bookId}`);
    return data ? JSON.parse(data) : [];
  }

  private saveLocalEntries(bookId: string, entries: Entry[]) {
    localStorage.setItem(`choosify_cashbook_entries_${bookId}`, JSON.stringify(entries));
  }

  // === PUBLIC BUSINESS SERVICE APIS ===

  // List all books folders
  public async getBooks(): Promise<Book[]> {
    const localBooks = this.getLocalBooks();
    
    if (!this.isConnected()) {
      // Calculate totals on the fly
      return localBooks.map((b) => {
        const entries = this.getLocalEntries(b.id);
        const totalIn = entries.filter(e => e.type === 'in').reduce((acc, current) => acc + current.amount, 0);
        const totalOut = entries.filter(e => e.type === 'out').reduce((acc, current) => acc + current.amount, 0);
        return {
          ...b,
          entryCount: entries.length,
          totalIn,
          totalOut
        };
      });
    }

    try {
      await this.initDriveStructure();
      if (!this.cashBookFolderId) return localBooks;

      // Search all folders under CashBook
      const q = `'${this.cashBookFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)`;
      const res = await this.googleFetch(url);
      const data = await res.json();

      const driveBooks: Book[] = [];
      const folders = data.files || [];

      for (const folder of folders) {
        try {
          // Read folder_info.json
          const infoFile = await this.findOrCreateFile('folder_info.json', folder.id, JSON.stringify({
            id: folder.name, // Book ID is the folder name
            name: 'Unnamed Book',
            color: '#FF5B00',
            icon: '📂',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));
          const info = JSON.parse(infoFile.content) as Book;

          // Read entry file to get count and quick totals
          const entriesFile = await this.findOrCreateFile('entries.json', folder.id, '[]');
          const entries = JSON.parse(entriesFile.content) as Entry[];

          const totalIn = entries.filter(e => e.type === 'in').reduce((acc, current) => acc + current.amount, 0);
          const totalOut = entries.filter(e => e.type === 'out').reduce((acc, current) => acc + current.amount, 0);

          driveBooks.push({
            ...info,
            entryCount: entries.length,
            totalIn,
            totalOut
          });
        } catch (innerErr) {
          console.error(`Error processing book folder ${folder.id}`, innerErr);
        }
      }

      // Sync local with drive (merge/override local to match cloud)
      this.saveLocalBooks(driveBooks);
      driveBooks.forEach(b => {
        // Cache entries locally too
        this.getEntries(b.id).catch(() => {});
      });

      return driveBooks;
    } catch (e: any) {
      console.error('Failed to load books from Google Drive, falling back to local storage', e);
      // Return local fallback on network error
      return localBooks.map((b) => {
        const entries = this.getLocalEntries(b.id);
        const totalIn = entries.filter(e => e.type === 'in').reduce((acc, current) => acc + current.amount, 0);
        const totalOut = entries.filter(e => e.type === 'out').reduce((acc, current) => acc + current.amount, 0);
        return {
          ...b,
          entryCount: entries.length,
          totalIn,
          totalOut
        };
      });
    }
  }

  // Create Book Folder and File
  public async createBook(name: string, color: string, icon: string): Promise<Book> {
    const bookId = `book-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBook: Book = {
      id: bookId,
      name,
      color,
      icon,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      entryCount: 0,
      totalIn: 0,
      totalOut: 0
    };

    // Save locally
    const books = this.getLocalBooks();
    books.push(newBook);
    this.saveLocalBooks(books);
    this.saveLocalEntries(bookId, []);

    if (this.isConnected()) {
      try {
        await this.initDriveStructure();
        if (this.cashBookFolderId) {
          // Create directory inside CashBook folder with name of bookId
          const bookFolderId = await this.findOrCreateFolder(bookId, this.cashBookFolderId);
          // Create folder_info.json and entries.json
          await this.findOrCreateFile('folder_info.json', bookFolderId, JSON.stringify(newBook));
          await this.findOrCreateFile('entries.json', bookFolderId, '[]');
        }
      } catch (e: any) {
        console.error('Failed to upload new book folder to Google Drive', e);
        toast.error(`Local book created. Drive upload failed: ${e.message}`);
      }
    }

    return newBook;
  }

  // Update existing book meta
  public async updateBookInfo(bookId: string, updates: Partial<Book>): Promise<Book> {
    const books = this.getLocalBooks();
    const updatedBooks = books.map((b) => {
      if (b.id === bookId) {
        return {
          ...b,
          ...updates,
          updated_at: new Date().toISOString()
        };
      }
      return b;
    });

    this.saveLocalBooks(updatedBooks);
    const updatedBook = updatedBooks.find(b => b.id === bookId)!;

    if (this.isConnected()) {
      try {
        await this.initDriveStructure();
        const bookFolderId = await this.findOrCreateFolder(bookId, this.cashBookFolderId!);
        const infoFile = await this.findOrCreateFile('folder_info.json', bookFolderId, JSON.stringify(updatedBook));
        await this.updateFileContent(infoFile.id, JSON.stringify(updatedBook));
      } catch (e: any) {
        console.error('Failed to sync updated book details to Google Drive', e);
      }
    }

    return updatedBook;
  }

  // Delete Book Folder and files
  public async deleteBook(bookId: string): Promise<void> {
    // 1. Delete locally
    const books = this.getLocalBooks();
    this.saveLocalBooks(books.filter(b => b.id !== bookId));
    localStorage.removeItem(`choosify_cashbook_entries_${bookId}`);

    // 2. Delete cloud
    if (this.isConnected()) {
      try {
        await this.initDriveStructure();
        const q = `'${this.cashBookFolderId}' in parents and name='${bookId}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
        const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)`;
        const searchRes = await this.googleFetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.files && searchData.files.length > 0) {
          const folderId = searchData.files[0].id;
          const deleteUrl = `https://www.googleapis.com/drive/v3/files/${folderId}`;
          const delRes = await this.googleFetch(deleteUrl, { method: 'DELETE' });
          if (!delRes.ok) {
            console.error('Delete failed in Google Drive');
          }
        }
      } catch (e: any) {
        console.error('Failed to delete book folder from Google Drive', e);
        toast.error(`Local book deleted. Drive deletion failed: ${e.message}`);
      }
    }
  }

  // Get list of entries for a given book details
  public async getEntries(bookId: string): Promise<Entry[]> {
    const localEntries = this.getLocalEntries(bookId);

    if (!this.isConnected()) {
      return localEntries;
    }

    try {
      await this.initDriveStructure();
      const bookFolderId = await this.findOrCreateFolder(bookId, this.cashBookFolderId!);
      const entryFileObj = await this.findOrCreateFile('entries.json', bookFolderId, '[]');
      const entries = JSON.parse(entryFileObj.content) as Entry[];
      
      // Sync local file with cloud
      this.saveLocalEntries(bookId, entries);
      return entries;
    } catch (e: any) {
      console.error(`Failed to load entries for book ${bookId} from Google Drive`, e);
      return localEntries;
    }
  }

  // Save full list of entries to a book folder
  public async saveEntries(bookId: string, entries: Entry[]): Promise<void> {
    // 1. Save locally
    this.saveLocalEntries(bookId, entries);

    // Update dynamic fields like update time in folder
    await this.updateBookInfo(bookId, { updated_at: new Date().toISOString() });

    // 2. Save to cloud
    if (this.isConnected()) {
      try {
        await this.initDriveStructure();
        const bookFolderId = await this.findOrCreateFolder(bookId, this.cashBookFolderId!);
        const entryFileObj = await this.findOrCreateFile('entries.json', bookFolderId, '[]');
        await this.updateFileContent(entryFileObj.id, JSON.stringify(entries));
      } catch (e: any) {
        console.error(`Failed to sync entries for book ${bookId} to Google Drive`, e);
        toast.error(`Local entry saved. Cloud sync failed: ${e.message}`);
      }
    }
  }
}

export const DriveService = new DriveServiceClass();
