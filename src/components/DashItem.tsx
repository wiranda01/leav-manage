import { CSSProperties } from "react";

type ItemProps = {
  title: string;
  color: CSSProperties;
  count: number | undefined;
}[];

const DashItem = ({ items }: { items: ItemProps }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          className="bg-primary-foreground rounded-t-lg p-4 border-b-[3px]"
          style={item.color}
          key={item.title}
        >
          <div className="flex justify-between items-center h-full">
            <p className="leading-7 [&:not(:first-child)]:mt-6">{item.title}</p>
            <h4 className="text-xl font-semibold tracking-tight">
              {item.count}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashItem;
