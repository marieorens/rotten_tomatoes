'use client';
import Link from 'next/link';
import { Film, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const navItems = [
    {
      label: 'Films',
      href: '/admin/films',
      icon: <Film className="w-5 h-5" />,
    },
    {
      label: 'Utilisateurs',
      href: '/admin/users',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="h-full w-56 bg-white border-r shadow-sm flex flex-col">
      <div className="p-6 border-b">
        <span className="font-bold text-xl text-blue-700">Administration</span>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 rounded-md mb-2 font-medium transition-colors cursor-pointer hover:bg-blue-50 ${active ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'text-slate-700'}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
