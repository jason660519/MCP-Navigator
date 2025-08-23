import { useMCP } from '../../context/MCPContext';

export default function CategoriesDebug() {
  const { mcpData, loading, error } = useMCP();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!mcpData) return <div>No data</div>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Categories Debug Info</h3>
      <p>Total categories: {mcpData.categories?.length || 0}</p>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Categories List:</h4>
        <ul className="space-y-1">
          {mcpData.categories?.map((category, index) => (
            <li key={index} className="text-sm">
              {category.icon} {category.name} ({category.count} servers)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}