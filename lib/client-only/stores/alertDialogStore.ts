import { create } from 'zustand';

interface CustomContent {
  type: string;
  props: any;
}

interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  onContinue: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  isLoading: boolean;
  customContent?: CustomContent;
  customFooter?: React.ReactNode;
  onSecondaryContinue?: () => void | Promise<void>;
  secondaryContinueText?: string;
  isSecondaryLoading?: boolean;
  open: (
    params: Omit<
      AlertDialogState,
      | 'isOpen'
      | 'open'
      | 'close'
      | 'isLoading'
      | 'setLoading'
      | 'isSecondaryLoading'
      | 'setSecondaryLoading'
    >
  ) => void;
  close: () => void;
  setLoading: (isLoading: boolean) => void;
  setSecondaryLoading: (isSecondaryLoading: boolean) => void;
}

export const useAlertDialogStore = create<AlertDialogState>((set) => ({
  isOpen: false,
  title: '',
  description: '',
  onContinue: async () => {},
  onCancel: async () => {},
  isLoading: false,
  open: (params) => set({ isOpen: true, isLoading: false, ...params }),
  close: () => {
    set({
      isOpen: false,
      isLoading: false,
      onContinue: undefined,
      onCancel: undefined,
      onSecondaryContinue: undefined,
      secondaryContinueText: undefined,
      isSecondaryLoading: undefined,
      customContent: undefined,
      customFooter: undefined,
    });
  },
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setSecondaryLoading: (isSecondaryLoading: boolean) => set({ isSecondaryLoading }),
}));
