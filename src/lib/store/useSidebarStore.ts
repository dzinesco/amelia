import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SidebarLinkType = {
  id: string;
  iconName: string;
  label: string;
  view: string;
  enabled: boolean;
  order: number;
};

interface SidebarState {
  links: SidebarLinkType[];
  toggleLink: (id: string) => void;
  reorderLinks: (links: SidebarLinkType[]) => void;
  resetToDefault: () => void;
}

const defaultLinks: SidebarLinkType[] = [
  {
    id: 'chat',
    iconName: 'MessageSquare',
    label: 'Chat',
    view: 'chat',
    enabled: true,
    order: 0
  },
  {
    id: 'workflow',
    iconName: 'GitBranch',
    label: 'Workflows',
    view: 'workflow',
    enabled: true,
    order: 1
  },
  {
    id: 'documents',
    iconName: 'FileText',
    label: 'Documents',
    view: 'documents',
    enabled: true,
    order: 2
  },
  {
    id: 'email',
    iconName: 'Mail',
    label: 'Email',
    view: 'email',
    enabled: true,
    order: 3
  },
  {
    id: 'tesla',
    iconName: 'Car',
    label: 'Tesla',
    view: 'tesla',
    enabled: true,
    order: 4
  },
  {
    id: 'home',
    iconName: 'Home',
    label: 'Smart Home',
    view: 'home',
    enabled: true,
    order: 5
  },
  {
    id: 'apple',
    iconName: 'Apple',
    label: 'Apple Services',
    view: 'apple',
    enabled: true,
    order: 6
  },
  {
    id: 'network',
    iconName: 'Network',
    label: 'Network',
    view: 'network',
    enabled: true,
    order: 7
  },
  {
    id: 'life360',
    iconName: 'MapPin',
    label: 'Life360',
    view: 'life360',
    enabled: true,
    order: 8
  },
  {
    id: '3cx',
    iconName: 'Phone',
    label: '3CX Phone',
    view: '3cx',
    enabled: true,
    order: 9
  }
];

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      links: defaultLinks,
      toggleLink: (id) =>
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, enabled: !link.enabled } : link
          ),
        })),
      reorderLinks: (links) => set({ links }),
      resetToDefault: () => set({ links: defaultLinks }),
    }),
    {
      name: 'sidebar-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            links: defaultLinks,
          };
        }
        return persistedState;
      },
    }
  )
);