export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ParsedReceipt {
  receiptNumber?: string;
  date?: string;
  time?: string;
  waiter?: string;
  items: ReceiptItem[];
  total: number;
}

export interface UserSelectionItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface UserSelection {
  user: string;
  items: UserSelectionItem[];
  amount: number;
  phone?: string;
}

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramWebApp {
  initDataUnsafe?: {
    user?: TelegramUser;
    web_app_data?: {
      data?: string;
    };
  };
  ready: () => void;
  expand: () => void;
  showAlert: (message: string, callback?: () => void) => void;
  sendData: (data: string) => void;
  close: () => void;
  MainButton: {
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    showProgress: (show: boolean) => void;
  };
}

export interface SyncData {
  users: string[];
  selections: Record<string, string[]>;
  lastUpdated: number;
}

export interface ItemSelectionState {
  users: string[];
  shares: Record<string, number>;
  isFractional?: boolean;
}

export interface UseTelegramWebAppResult {
  webApp: TelegramWebApp | undefined;
  receipt: ParsedReceipt | undefined;
  isLoading: boolean;
  error: string | null;
  closeWebApp: (data?: {
    receipt: ParsedReceipt;
    totals?: Array<{
      user: string;
      amount: number;
      phone?: string;
      items?: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
        total: number;
      }>;
    }>;
  }) => void;
}

export interface ItemSelectionProps {
  webApp?: TelegramWebApp;
  receipt?: ParsedReceipt;
  isLoading: boolean;
  error: string | null;
  closeWebApp: (data: any) => void;
}

export interface ReceiptItemProps {
  item: ReceiptItem;
  selected: boolean;
  onToggle: () => void;
  users: string[];
  selectedUsers: string[];
  onUserSelect: (userId: string) => void;
  onShareChange: (userId: string, share: number) => void;
  userShares: Record<string, number>;
  totalShares: number;
  isFractional?: boolean;
}

export interface Props {
  receipt: ParsedReceipt;
  selections: UserSelection[];
}

export interface UserBadgeProps {
  username: string;
  onRemove: () => void;
}

export interface UserSelectorProps {
  onAddUser: (username: string) => void;
  users: string[];
  onRemoveUser: (username: string) => void;
}