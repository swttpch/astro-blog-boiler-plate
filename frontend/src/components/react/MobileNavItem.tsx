import { useState } from 'react';
import type StrapiNavigation from '../../interfaces/navigation';
import type { CategoryPlain } from '../../interfaces/category';

function MobileNavItem({ item }: { item: StrapiNavigation<CategoryPlain> }) {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => {
    setIsOpen((old) => !old);
  };
  return (
    <>
      <div className="flex flex-col self-stretch py-0 transition-all ">
        <div className=" flex h-80 justify-between items-center self-stretch ">
          <a href={'/c/' + item.related.slug} className="text-text-sub">
            <span>{item.related.title}</span>
          </a>
          <button
            onClick={onToggle}
            {...(isOpen ? { 'data-active': true } : {})}
            className="data-[active]:rotate-180 transition-all text-icon-sub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11.9997 13.1717L16.9497 8.22168L18.3637 9.63568L11.9997 15.9997L5.63574 9.63568L7.04974 8.22168L11.9997 13.1717Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div
          {...(isOpen ? { 'data-active': true } : {})}
          className={`${isOpen ? 'h-auto opacity-100' : 'h-0 opacity-0'} transition-all duration-500 px-24 ease-in-out overflow-hidden flex-col flex border-b border-border-soft`}
        >
          {item.related.highlights.map((subitem) => (
            <a
              href={'/p/' + subitem.slug}
              key={subitem.id}
              className="h-64 text-text-sub text-sm self-stretch"
            >
              <span>{subitem.title}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default MobileNavItem;
