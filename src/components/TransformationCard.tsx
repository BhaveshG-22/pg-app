type TransformationCardProps = {
  beforeImage: string;
  afterImage: string;
  userAvatar: string;
  userName: string;
  category: string;
  skillLevel: string;
  duration: string;
  title: string;
  viewCount: string;
  completionRate: string;
};

export default function TransformationCard({
  beforeImage,
  afterImage,
  userAvatar,
  userName,
  category,
  skillLevel,
  duration,
  title,
  viewCount,
  completionRate,
}: TransformationCardProps) {
  return (
    <div className="bg-[#2f2f2f] rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
      <div className="relative">
        <div className="flex relative">
          <div className="w-1/2 relative">
            <img 
              src={beforeImage}
              alt="Before" 
              className="w-full h-48 object-cover filter grayscale"
            />
          </div>
          <div className="w-1/2 relative">
            <img 
              src={afterImage}
              alt="After" 
              className="w-full h-48 object-cover"
            />
          </div>
          {/* Dividing line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white/30 z-10"></div>
          
          {/* User info overlay */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <img 
              src={userAvatar}
              alt="User" 
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <span className="text-white text-sm font-medium drop-shadow-lg">{userName}</span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-black">
        <div className="text-xs text-gray-400 mb-2">{category} • {skillLevel} • {duration}</div>
        <h3 className="text-white text-base font-medium mb-3">{title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{completionRate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}