interface CardFooterProps {
  source?: string;
  onReadMore?: () => void;
  onAskMore?: () => void;
}

export default function CardFooter({ source, onReadMore, onAskMore }: CardFooterProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      {source && <span className="text-xs text-gray-500">資料來源：{source}</span>}
      {onReadMore && (
        <button className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs" onClick={onReadMore}>
          延伸閱讀
        </button>
      )}
      {onAskMore && (
        <button className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs" onClick={onAskMore}>
          追問
        </button>
      )}
    </div>
  );
} 