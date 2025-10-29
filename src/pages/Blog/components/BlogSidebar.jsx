import FilterContents from './FilterContents'; 

const BlogSidebar = ({ posts, onFilterChange }) => { 
  return (
    <aside className="w-full p-6 md:p-8"> {/* <-- Cambiado md:w-1/4 */}
      <div className="sticky top-24">
        <FilterContents 
          posts={posts} 
          onFilterChange={onFilterChange} 
        />
      </div>
    </aside>
  );
};

export default BlogSidebar;