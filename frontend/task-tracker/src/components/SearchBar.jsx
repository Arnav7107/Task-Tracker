// export default function SearchBar({ searchText, setSearchText, debounced }) {
//   return (
//     <div className="w-full md:w-80">
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Search tasks..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-sm"
//         />
//         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
//           🔍
//         </span>
//       </div>

//       {searchText && (
//         <p className="text-xs text-gray-500 mt-1">
//           Searching <span className="text-amber-300">"{searchText}"</span>{" "}
//           {searchText !== debounced && "(waiting…)"}
//         </p>
//       )}
//     </div>
//   );
// }




export default function SearchBar({ searchText, setSearchText }) {
  return (
    <div className="w-full md:w-80">
      <div className="relative">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-sm"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          🔍
        </span>
      </div>

      {/* Search text indicator */}
      {searchText && (
        <p className="text-xs text-gray-500 mt-1">
          Showing results for{" "}
          <span className="text-amber-300">"{searchText}"</span>
        </p>
      )}
    </div>
  );
}
