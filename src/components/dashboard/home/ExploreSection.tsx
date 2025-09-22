export default function ExploreSection() {
  return (
    <div className="mb-6 mt-4 select-none">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white tracking-tight">Which one do you want to explore today?</h2>
        <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
          View All
        </button>
      </div>
      <p className="text-sm text-gray-300 max-w-3xl">
        Explore handpicked styles below and start transforming your image with just one click.
      </p>
    </div>
  )
}