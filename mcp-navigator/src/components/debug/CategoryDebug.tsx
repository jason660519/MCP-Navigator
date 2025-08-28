import { useParams } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import { slugify, unslugify } from '../../lib/utils';

/**
 * Debug component: used to check category matching logic
 */
export default function CategoryDebug() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { mcpData } = useMCP();

  if (!mcpData || !categorySlug) {
    return <div>No data or slug</div>;
  }

  const categoryName = unslugify(categorySlug);
  const foundCategory = mcpData.categories.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Category Debug Info</h3>
      <div className="space-y-2 text-sm">
        <p><strong>URL Slug:</strong> {categorySlug}</p>
        <p><strong>Unslugified Name:</strong> {categoryName}</p>
        <p><strong>Found Category:</strong> {foundCategory ? foundCategory.name : 'NOT FOUND'}</p>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Available Categories:</h4>
          <ul className="space-y-1">
            {mcpData.categories.map((cat, index) => {
              const slug = slugify(cat.name);
              const isMatch = cat.name.toLowerCase() === categoryName.toLowerCase();
              return (
                <li key={index} className={`${isMatch ? 'bg-green-200' : ''} p-1 rounded`}>
                  <strong>{cat.name}</strong> → slug: <code>{slug}</code>
                  {isMatch && <span className="text-green-600 ml-2">✓ MATCH</span>}
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Test Slugify/Unslugify:</h4>
          {mcpData.categories.slice(0, 5).map((cat, index) => {
            const slug = slugify(cat.name);
            const unslug = unslugify(slug);
            return (
              <div key={index} className="text-xs">
                {cat.name} → {slug} → {unslug}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}