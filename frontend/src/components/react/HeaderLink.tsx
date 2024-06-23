import { twMerge } from 'tailwind-merge';

function HeaderLink(props: HTMLAnchorElement) {
  const { href, className, children, ...rest } = props;
  return (
    <>
      <a
        data-is-active={isActive}
        href={href}
        className={twMerge(
          'px-20 transition-all flex justify-center items-center gap-2 text-text-sub text-base box-content font-normal leading-6 border-b border-transparent data-[is-active]:border-b-primary-base data-[is-active]:text-text-main hover:text-text-main hover:border-b-primary-base',
          className,
        )}
        {...rest}
      >
        {children}
      </a>
    </>
  );
}

export default HeaderLink;
