import { Breadcrumbs } from './Breadcrumbs';
import { SearchInput } from '@/components/ui/SearchInput';

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-neutral flex items-center justify-between px-8 py-3">
      <Breadcrumbs />
      <SearchInput />
    </header>
  );
}
