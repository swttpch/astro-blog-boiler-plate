import { twMerge, type ClassNameValue } from 'tailwind-merge';

function AvatarPhoto({ name, className }: { name: string; className?: ClassNameValue }) {
  const getFirstLetter = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const firstLetter = getFirstLetter(name);
  const getSecondNameFirstLetter = (name: string): string => {
    const names = name.split(' ');
    if (names.length > 1) {
      return names[1].charAt(0).toUpperCase();
    }
    return '';
  };

  const secondNameFirstLetter = getSecondNameFirstLetter(name);
  return (
    <>
      <div
        className={twMerge([
          'w-[48px] h-[48px] relative rounded-full bg-primary-base text-primary-lighter flex items-center justify-center',
          className,
        ])}
      >
        <div className="text-xl">
          {secondNameFirstLetter ? `${firstLetter}${secondNameFirstLetter}` : firstLetter}
        </div>
      </div>
    </>
  );
}

export default AvatarPhoto;
