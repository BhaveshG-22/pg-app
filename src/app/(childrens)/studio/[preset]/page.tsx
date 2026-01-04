'use client'

import { Upload, ChevronLeft, ChevronRight, Sparkles, GripVertical, X, ImageIcon, Camera, FolderOpen, Eye, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useDbUser } from '@/hooks/useDbUser'
import { OUTPUT_SIZES } from '@/lib/constants'
import { uploadOnly, validateFile, confirmUpload } from '@/lib/upload'
import GeneratedImagesDisplay from '@/components/GeneratedImagesDisplay'
import ErrorModal from '@/components/ErrorModal'
import { UserImage } from '@/types/user'
import { StatefulButton } from '@/components/ui/stateful-button'

// Function to load single preset data and transformations from API
const loadPresetData = async (slug: string) => {
  try {
    const response = await fetch(`/api/presets/${slug}`);
    const data = await response.json();

    if (data.success && data.preset) {
      return {
        preset: data.preset,
        transformations: data.transformations || []
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Failed to load preset:', error);
    return null;
  }
};

function Input({ label, placeholder, required, value, onChange }: {
  label: string;
  placeholder: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-sidebar-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        maxLength={200}
      />
    </div>
  );
}

function Textarea({ label, placeholder, value, onChange }: {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-sidebar-foreground">{label}</label>
      <textarea
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        rows={4}
        maxLength={200}
      />
    </div>
  );
}





// Enhanced Upload Modal Component

const UploadModal = ({ isOpen, onClose, onImageSelect, onAwsUpload, isUploading, uploadProgress, preloadedImages, onRefreshImages }: {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageData: string | { displayUrl: string; s3Key: string }) => void;
  onAwsUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  preloadedImages: UserImage[];
  onRefreshImages: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [userImages, setUserImages] = useState<UserImage[]>(preloadedImages);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Update local images when preloaded images change
  useEffect(() => {
    setUserImages(preloadedImages);
  }, [preloadedImages]);

  // Only fetch fresh images if needed (when preloaded is empty and gallery is accessed)
  const fetchUserImages = async () => {
    if (preloadedImages.length > 0) return; // Use preloaded images

    setLoadingImages(true);
    try {
      const response = await fetch('/api/uploads/user-images?limit=20');
      if (response.ok) {
        const data = await response.json();
        setUserImages(data.images);
      } else {
        console.error('Failed to fetch user images');
      }
    } catch (error) {
      console.error('Error fetching user images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  // Only fetch if no preloaded images and gallery tab is accessed
  useEffect(() => {
    if (isOpen && activeTab === 'gallery' && preloadedImages.length === 0) {
      fetchUserImages();
    }
  }, [isOpen, activeTab, preloadedImages.length]);

  const handleFileUpload = async (file: File) => {
    await onAwsUpload(file);
    // Refresh images list after upload
    onRefreshImages();
  };

  const handleImageSelection = (image: UserImage) => {
    onImageSelect({
      displayUrl: image.displayUrl || image.thumbnailDisplayUrl || '',
      s3Key: image.url // url field contains the S3 key
    });
    onClose();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };


  // I guess this is where I have to upload the image to AWS right
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Select Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-6 text-sm font-medium transition-colors ${activeTab === 'upload'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/30'
              }`}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Upload New
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-3 px-6 text-sm font-medium transition-colors ${activeTab === 'gallery'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/30'
              }`}
          >
            <FolderOpen className="h-4 w-4 inline mr-2" />
            Previous Images
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[60vh]">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-4 sm:p-8 text-center transition-all cursor-pointer ${dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                  }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Camera className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
                <p className="text-base sm:text-lg font-medium text-card-foreground mb-2">
                  {dragOver ? 'Drop your image here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">PNG, JPG, or WEBP (Max 10MB)</p>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">Uploading your image to cloud...</span>
                    <span className="text-sm text-primary">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-primary/20 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your image will be processed after upload completes
                  </p>
                </div>
              )}

              {/* Upload Tips */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-medium text-card-foreground mb-2">Tips for best results:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use high-quality images (at least 512x512 pixels)</li>
                  <li>• Ensure good lighting and clear subject visibility</li>
                  <li>• Avoid heavily filtered or low-resolution images</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-card-foreground">Recently Used Images</h3>
                <span className="text-sm text-muted-foreground">
                  {loadingImages ? 'Loading...' : `${userImages.length} image${userImages.length !== 1 ? 's' : ''}`}
                </span>
              </div>

              {loadingImages ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your images...</p>
                </div>
              ) : userImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 max-h-64 sm:max-h-80 overflow-y-auto">
                  {userImages.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => handleImageSelection(image)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:scale-105 group ${selectedImageId === image.id
                        ? 'border-primary ring-2 ring-primary/50 shadow-lg'
                        : 'border-border hover:border-primary/50'
                        }`}
                    >
                      <img
                        src={image.thumbnailDisplayUrl || image.displayUrl || ''}
                        alt={image.originalFileName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Failed to load image:', image.thumbnailDisplayUrl || image.displayUrl);
                          // Mark this image as having an error
                          setImageErrors(prev => new Set(prev).add(image.id));
                        }}
                        onLoad={() => {
                          // Remove from error set if it loads successfully
                          setImageErrors(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(image.id);
                            return newSet;
                          });
                        }}
                      />

                      {/* Show fallback if image failed to load */}
                      {imageErrors.has(image.id) && (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-xs">Image not available</p>
                          </div>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Eye className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">Select Image</p>
                        </div>
                      </div>

                      {/* Image info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs text-white truncate font-medium">
                          {image.originalFileName}
                        </p>
                        <p className="text-xs text-white/70">
                          {(image.fileSize / 1024 / 1024).toFixed(1)} MB • {image.width}×{image.height}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No previously used images</p>
                  <p className="text-sm text-muted-foreground/70">Images you upload will appear here</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Upload Your First Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dynamic Before/After Slider Component
const DynamicSlider = ({ presetData, selectedGeneratedImage, onDownloadGenerated, generatedImageAspectRatio, exampleTransformations }: {
  presetData: any;
  selectedGeneratedImage: string | null;
  onDownloadGenerated?: () => void;
  generatedImageAspectRatio: string | null;
  exampleTransformations: Array<{ before: string, after: string, title: string }>;
}) => {
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [exampleAspectRatio, setExampleAspectRatio] = useState<string>('aspect-square');

  // Detect aspect ratio of the first example image
  useEffect(() => {
    if (exampleTransformations.length > 0 && exampleTransformations[0].before) {
      const img = window.document.createElement('img');
      img.src = exampleTransformations[0].before;
      img.onload = () => {
        const ratio = img.width / img.height;

        // Determine aspect ratio class based on image dimensions
        if (ratio >= 1.7) {
          setExampleAspectRatio('aspect-video'); // 16:9
        } else if (ratio >= 1.4) {
          setExampleAspectRatio('aspect-[4/3]'); // 4:3
        } else if (ratio >= 1.1) {
          setExampleAspectRatio('aspect-[5/4]'); // 5:4
        } else if (ratio >= 0.9 && ratio <= 1.1) {
          setExampleAspectRatio('aspect-square'); // 1:1
        } else if (ratio >= 0.7) {
          setExampleAspectRatio('aspect-[4/5]'); // 4:5 portrait
        } else {
          setExampleAspectRatio('aspect-[9/16]'); // 9:16 vertical
        }
      };
    }
  }, [exampleTransformations]);

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;

    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    }

    const percentage = (x / rect.width) * 100;
    setInset(Math.max(0, Math.min(100, percentage)));
  };

  // Use dynamic images from carousel examples or selected generated image
  const currentExample = exampleTransformations[currentExampleIndex];
  const beforeImageSrc = currentExample?.before;
  const afterImageSrc = selectedGeneratedImage || currentExample?.after;


  // Navigation functions
  const goToPrevious = () => {
    setCurrentExampleIndex((prev) =>
      prev === 0 ? exampleTransformations.length - 1 : prev - 1
    );
    setInset(50); // Reset slider to center
  };

  const goToNext = () => {
    setCurrentExampleIndex((prev) =>
      prev === exampleTransformations.length - 1 ? 0 : prev + 1
    );
    setInset(50); // Reset slider to center
  };

  // Fallback placeholder URLs
  const beforeFallback = "https://via.placeholder.com/800x600/e2e8f0/64748b?text=Before+Photo";
  const afterFallback = "https://via.placeholder.com/800x600/dc2626/ffffff?text=After+Photo";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {/* <Badge variant="secondary" className={presetData.badgeColor}>
          {presetData.badge}
        </Badge> */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-sidebar-foreground leading-tight">
            {presetData.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {presetData.description}
          </p>
        </div>
      </div>

      <div className="pt-6 w-full flex justify-center">
        <div className="w-full max-w-2xl">
          <div
            className={`relative ${generatedImageAspectRatio || exampleAspectRatio} w-full max-h-[40vh] sm:max-h-[50vh] overflow-hidden rounded-xl sm:rounded-2xl select-none shadow-xl border border-border`}
            onMouseMove={onMouseMove}
            onMouseUp={() => setOnMouseDown(false)}
            onTouchMove={onMouseMove}
            onTouchEnd={() => setOnMouseDown(false)}
          >
            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all duration-200"
              title="Previous example"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all duration-200"
              title="Next example"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Download button for generated images */}
            {selectedGeneratedImage && onDownloadGenerated && (
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-30">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadGenerated();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2"
                  title="Download generated image"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">Download</span>
                </button>
              </div>
            )}
            {/* Slider Handle */}
            <div
              className="bg-white h-full w-1 absolute z-20 top-0 -ml-1 select-none shadow-lg"
              style={{
                left: inset + "%",
              }}
            >
              <button
                className="bg-white rounded-full hover:scale-110 transition-all w-8 h-8 select-none -translate-y-1/2 absolute top-1/2 -ml-4 z-30 cursor-ew-resize flex justify-center items-center shadow-xl border-2 border-primary"
                onTouchStart={(e) => {
                  setOnMouseDown(true);
                  onMouseMove(e);
                }}
                onMouseDown={(e) => {
                  setOnMouseDown(true);
                  onMouseMove(e);
                }}
                onTouchEnd={() => setOnMouseDown(false)}
                onMouseUp={() => setOnMouseDown(false)}
              >
                <GripVertical className="h-4 w-4 select-none text-primary" />
              </button>
            </div>


            {/* After Image (Christmas Version) - Using Next.js Image with fallback */}
            {!imageError && afterImageSrc ? (
              <Image
                src={afterImageSrc}
                alt="Christmas transformed photo"
                width={800}
                height={800}
                priority={currentExampleIndex < 2} // Prioritize first 2 images
                className="absolute left-0 top-0 z-10 w-full h-full rounded-2xl select-none object-cover"
                style={{
                  clipPath: "inset(0 0 0 " + inset + "%)",
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <img
                src={afterFallback}
                alt="Christmas transformed photo"
                className="absolute left-0 top-0 z-10 w-full h-full rounded-2xl select-none object-cover"
                style={{
                  clipPath: "inset(0 0 0 " + inset + "%)",
                }}
              />
            )}

            {/* Before Image (Original) - Using Next.js Image with fallback */}
            {!imageError && beforeImageSrc ? (
              <Image
                src={beforeImageSrc}
                alt="Original photo before Christmas transformation"
                width={800}
                height={800}
                priority={currentExampleIndex < 2} // Prioritize first 2 images
                className="absolute left-0 top-0 w-full h-full rounded-2xl select-none object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <img
                src={beforeFallback}
                alt="Original photo before Christmas transformation"
                className="absolute left-0 top-0 w-full h-full rounded-2xl select-none object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

enum Status{
  QUEUED,
  RUNNING,
  COMPLETED
}

export default function StudioPage() {
  const params = useParams();
  const preset = params.preset as string;
  const { user: clerkUser, isLoaded } = useUser();
  const { user: dbUser, isLoaded: isDbUserLoaded, refetchUser } = useDbUser();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageS3Key, setSelectedImageS3Key] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ url: string, aspectRatio: string }[]>([]);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedOutputSize, setSelectedOutputSize] = useState<keyof typeof OUTPUT_SIZES>('SQUARE');
  const [presetData, setPresetData] = useState<any>(null);
  const [isLoadingPreset, setIsLoadingPreset] = useState(true);
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);
  const [exampleTransformations, setExampleTransformations] = useState<Array<{ before: string, after: string, title: string }>>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [otherIdeas, setOtherIdeas] = useState<string>('');
  const [jobStatus, setJobStatus] = useState('')

  // Error modal state
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'error' | 'warning' | 'info';
    actionButton?: { text: string; onClick: () => void };
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  })

  // Background user images loading
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [userImagesLoaded, setUserImagesLoaded] = useState(false);

  // Fetch existing generations on page load
  useEffect(() => {
    const fetchExistingGenerations = async () => {
      if (!isLoaded || !clerkUser || !presetData?.id) return;

      try {
        const response = await fetch(`/api/generations?presetId=${presetData.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.generations && data.generations.length > 0) {
            // Convert existing generations to the format expected by generatedImages state
            const existingImages = data.generations.map((gen: any) => ({
              url: gen.outputUrl,
              aspectRatio: gen.outputSize ? OUTPUT_SIZES[gen.outputSize as keyof typeof OUTPUT_SIZES]?.aspectRatio || 'aspect-square' : 'aspect-square'
            }));
            setGeneratedImages(existingImages);
          }
        }
      } catch (error) {
        console.error('Error fetching existing generations:', error);
      }
    };

    fetchExistingGenerations();
  }, [isLoaded, clerkUser, presetData?.id]);

  // Load preset data and transformations
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingPreset(true);
      const result = await loadPresetData(preset);

      if (result && result.preset) {
        console.log('📝 Preset data loaded:', result.preset);
        console.log('🔧 Input fields:', result.preset.inputFields);
        console.log('📋 Variables:', result.preset.variables);
        setPresetData(result.preset);
        setExampleTransformations(result.transformations);

        // Initialize inputValues with default values
        if (result.preset.inputFields && result.preset.inputFields.length > 0) {
          const defaultValues: Record<string, string> = {};
          result.preset.inputFields.forEach((field: any, index: number) => {
            const fieldKey = field.name || `input_${index}`;
            if (field.defaultValue) {
              defaultValues[fieldKey] = field.defaultValue;
            }
          });
          setInputValues(defaultValues);
        }
      } else {
        // If preset not found, set error state
        console.error('Preset not found for slug:', preset);
        setPresetData(null);
      }
      setIsLoadingPreset(false);
    };

    loadData();
  }, [preset]);

  // Background loading of user images with presigned URLs
  useEffect(() => {
    const loadUserImages = async () => {
      if (!isLoaded || !clerkUser) return;

      try {
        // 1. Fetch user images (with S3 keys)
        const response = await fetch('/api/uploads/user-images?limit=20');
        if (response.ok) {
          const data = await response.json();

          // 2. Generate presigned URLs for viewing
          if (data.images.length > 0) {
            const keys = data.images.map((img: UserImage) => img.url); // url field contains S3 key
            const presignResponse = await fetch('/api/gallery/presign', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ keys })
            });

            if (presignResponse.ok) {
              const { urls } = await presignResponse.json();

              // 3. Map presigned URLs back to images
              const imagesWithUrls = data.images.map((img: UserImage, index: number) => {
                const urlData = urls[index];
                return {
                  ...img,
                  displayUrl: urlData.success ? urlData.url : null,
                  thumbnailDisplayUrl: urlData.success ? urlData.url : null // Same URL for thumbnail
                };
              });

              setUserImages(imagesWithUrls);
            } else {
              console.error('Failed to generate presigned URLs');
              setUserImages(data.images); // Use without presigned URLs
            }
          } else {
            setUserImages(data.images);
          }
        }
      } catch (error) {
        console.error('Error loading user images in background:', error);
      } finally {
        setUserImagesLoaded(true);
      }
    };

    loadUserImages();
  }, [isLoaded, clerkUser]);

  // Function to refresh user images (called after upload)
  const refreshUserImages = async () => {
    if (!isLoaded || !clerkUser) return;

    try {
      // 1. Fetch user images (with S3 keys)
      const response = await fetch('/api/uploads/user-images?limit=20');
      if (response.ok) {
        const data = await response.json();

        // 2. Generate presigned URLs for viewing
        if (data.images.length > 0) {
          const keys = data.images.map((img: UserImage) => img.url); // url field contains S3 key
          const presignResponse = await fetch('/api/gallery/presign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keys })
          });

          if (presignResponse.ok) {
            const { urls } = await presignResponse.json();

            // 3. Map presigned URLs back to images
            const imagesWithUrls = data.images.map((img: UserImage, index: number) => {
              const urlData = urls[index];
              return {
                ...img,
                displayUrl: urlData.success ? urlData.url : null,
                thumbnailDisplayUrl: urlData.success ? urlData.url : null
              };
            });

            setUserImages(imagesWithUrls);
          } else {
            setUserImages(data.images);
          }
        } else {
          setUserImages(data.images);
        }
      }
    } catch (error) {
      console.error('Error refreshing user images:', error);
    }
  };

  // Preload images after preset data and transformations are loaded
  useEffect(() => {
    if (!presetData || isLoadingPreset) return;

    console.log('Main component: Starting image preload process');
    console.log('Found transformations:', exampleTransformations.length);

    const preloadImages = async () => {
      try {
        if (exampleTransformations.length === 0) {
          console.log('No images to preload, setting areImagesLoaded to true');
          setAreImagesLoaded(true);
          return;
        }

        // Get all unique image URLs
        const allImageUrls = exampleTransformations.flatMap((item: any) =>
          [item.before, item.after].filter(Boolean)
        );

        console.log('Preloading', allImageUrls.length, 'images');

        // Preload images
        const preloadPromises = allImageUrls.map((url: string) => {
          return new Promise<void>((resolve) => {
            const img = document.createElement('img');
            const handleComplete = () => resolve();
            img.onload = handleComplete;
            img.onerror = handleComplete;
            img.src = url;
          });
        });

        await Promise.allSettled(preloadPromises);
        console.log('All images preloaded, setting areImagesLoaded to true');
        setAreImagesLoaded(true);
      } catch (error) {
        console.error('Failed to preload images:', error);
        setAreImagesLoaded(true); // Set to true to avoid infinite loading
      }
    };

    preloadImages();
  }, [presetData, isLoadingPreset, exampleTransformations]);

  // Scroll to top when the preset changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [preset]);

  const handleImageSelect = (imageData: string | { displayUrl: string; s3Key: string }) => {
    if (typeof imageData === 'string') {
      // Direct URL (from upload)
      setSelectedImage(imageData);
    } else {
      // From gallery selection
      setSelectedImage(imageData.displayUrl);
      setSelectedImageS3Key(imageData.s3Key);
    }
  };

  // AWS S3 Upload Handler
  const handleAwsFileUpload = async (file: File) => {
    if (!presetData || !dbUser) {
      setErrorModal({
        isOpen: true,
        title: 'Please Wait',
        message: 'Please wait for the preset to load and ensure you are logged in before uploading.',
        type: 'info'
      });
      return;
    }

    // Validate file before upload
    const validation = validateFile(file, dbUser.tier);
    if (!validation.valid) {
      setErrorModal({
        isOpen: true,
        title: 'Invalid File',
        message: validation.error || 'Please select a valid image file.',
        type: 'warning'
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload to S3 only (no processing)
      const result = await uploadOnly({
        file,
        onProgress: (progress: number) => {
          setUploadProgress(progress);
        },
        onSuccess: async (s3Key: string) => {
          console.log('Upload successful:', s3Key);
          setUploadProgress(100);

          // Save image to user's database
          try {
            const saveResponse = await fetch('/api/uploads/save-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                s3Key: s3Key,
                fileName: s3Key.split('/').pop() || 'uploaded-image',
                originalFileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
                width: 1024, // Default width, could be extracted from image if needed
                height: 1024, // Default height, could be extracted from image if needed
              }),
            });

            if (saveResponse.ok) {
              const saveResult = await saveResponse.json();
              console.log('Image saved to database:', saveResult.image);

              // Generate presigned URL for display (same as gallery images)
              const presignResponse = await fetch('/api/gallery/presign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keys: [s3Key] })
              });

              if (presignResponse.ok) {
                const { urls } = await presignResponse.json();
                const urlData = urls[0];
                if (urlData.success) {
                  // Use presigned URL for display (same as gallery selection)
                  setSelectedImage(urlData.url);
                  setSelectedImageS3Key(s3Key); // Store S3 key for generation
                } else {
                  console.error('Failed to generate presigned URL for uploaded image');
                }
              } else {
                console.error('Failed to request presigned URL for uploaded image');
              }
            } else {
              console.error('Failed to save image to database');
            }
          } catch (error) {
            console.error('Error saving image to database:', error);
          }
        },
        onError: (error: string) => {
          console.error('Upload failed:', error);
          setErrorModal({
            isOpen: true,
            title: 'Upload Failed',
            message: `Failed to upload your image:\n\n${error}\n\nPlease try again or check your internet connection.`,
            type: 'error'
          });
        }
      });

      // Close modal after upload (no processing started)
      setIsUploadModalOpen(false);

      // Refresh the images list
      refreshUserImages();

    } catch (error) {
      console.error('Upload error:', error);
      setErrorModal({
        isOpen: true,
        title: 'Upload Failed',
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again or check your internet connection.`,
        type: 'error'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Check if all required fields are filled (or have default values)
  const areRequiredFieldsFilled = () => {
    if (!presetData || !presetData.inputFields || presetData.inputFields.length === 0) {
      return true; // No required fields, so it's valid
    }

    // Check all required fields - allow empty if there's a default value
    return presetData.inputFields.every((field: any) => {
      if (!field.required) return true;

      const fieldKey = field.name || `input_${presetData.inputFields.indexOf(field)}`;
      const userValue = inputValues[fieldKey];
      const hasDefault = field.defaultValue && field.defaultValue.trim() !== '';

      // Field is valid if user provided a value OR there's a default value to fall back to
      return (userValue && userValue.trim() !== '') || hasDefault;
    });
  };

  // Poll for completion after S3 upload
  const pollForCompletion = async (jobId: string, selectedOutputSize: keyof typeof OUTPUT_SIZES) => {
    const maxAttempts = 60; // 5 minutes max (5s intervals)
    let attempts = 0;

    setIsGenerating(true);

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`/api/generations/${jobId}`);
        const result = await response.json();

        setJobStatus(result.status);

        if (result.status === 'COMPLETED' && result.outputUrl) {
          const selectedAspectRatio = OUTPUT_SIZES[selectedOutputSize].aspectRatio;

          // Add the completed image to generated images
          const newGeneratedImage = {
            url: result.outputUrl,
            aspectRatio: selectedAspectRatio
          };

          setGeneratedImages(prev => [newGeneratedImage, ...prev]); // Add new image at the beginning
          console.log('S3 upload + generation completed successfully!');

          // Refresh user data to update credits in navbar
          console.log('🔄 Calling refetchUser to update credits...');
          await refetchUser();
          console.log('✅ refetchUser completed');

          // Reset job status after 3 seconds to allow new generation
          setTimeout(() => {
            setJobStatus('');
          }, 3000);

          break;
        }

        if (result.status === 'FAILED' || result.status === 'CANCELLED') {
          console.error('Generation failed:', result.error);
          setErrorModal({
            isOpen: true,
            title: 'Generation Failed',
            message: `Image generation failed: ${result.error || 'Unknown error'}\n\nPlease try again or contact support if the problem persists.`,
            type: 'error'
          });
          break;
        }

        // Still processing, wait and retry
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
        attempts++;

      } catch (error) {
        console.error('Polling error:', error);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    if (attempts >= maxAttempts) {
      console.error('Generation timed out');
      setErrorModal({
        isOpen: true,
        title: 'Generation Timeout',
        message: 'The image generation took too long and timed out.\n\nThis may be due to high server load. Please try again in a few minutes.',
        type: 'warning'
      });
    }

    setIsGenerating(false);
  };

  const handleGenerate = async () => {
    if (!selectedImage || !selectedImageS3Key || !presetData || !areRequiredFieldsFilled()) return;

    setIsGenerating(true);
    setJobStatus('PENDING'); // Show loading state while waiting for jobId

    try {
      // Prepare input values with defaults for empty fields
      const finalInputValues: Record<string, string> = {};

      if (presetData.inputFields && presetData.inputFields.length > 0) {
        presetData.inputFields.forEach((field: any, index: number) => {
          const fieldKey = field.name || `input_${index}`;
          const userValue = inputValues[fieldKey];

          // If user provided a value (even empty string), use it if not empty
          // Otherwise fall back to default value
          finalInputValues[fieldKey] = (userValue && userValue.trim() !== '')
            ? userValue
            : (field.defaultValue || '');
        });
      }

      // First, confirm the upload and start processing
      const confirmResult = await confirmUpload({
        s3Key: selectedImageS3Key, // Use the stored S3 key
        presetId: presetData.id,
        inputValues: finalInputValues,
        outputSize: selectedOutputSize,
      });

      console.log('Processing started with job ID:', confirmResult.jobId);

      // Poll for completion using the job ID
      if (confirmResult.jobId) {
        await pollForCompletion(confirmResult.jobId, selectedOutputSize);
      } else {
        throw new Error('No job ID returned from confirm upload');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);

      // Handle specific error cases
      if (error.code === 'insufficient_credits') {
        // Create a more user-friendly error message for insufficient credits
        const creditsNeeded = presetData.credits;
        const currentCredits = dbUser?.credits || 0;
        const creditsShort = creditsNeeded - currentCredits;

        setErrorModal({
          isOpen: true,
          title: 'Insufficient Credits',
          message: `You don't have enough credits to generate this image.

💳 Credit Details:
• Required: ${creditsNeeded} credits
• You have: ${currentCredits} credits
• You need: ${creditsShort} more credits

Upgrade your plan or purchase more credits to continue creating amazing images.`,
          type: 'warning',
          actionButton: {
            text: 'Upgrade Plan',
            onClick: () => {
              setErrorModal(prev => ({ ...prev, isOpen: false }));
              // Navigate to pricing/upgrade page
              window.open('/pricing', '_blank');
            }
          }
        });
      } else if (error.code === 'too_many_in_flight') {
        setErrorModal({
          isOpen: true,
          title: 'Too Many Active Generations',
          message: `⏳ You have too many generations in progress.

Please wait for them to complete before starting a new one.

This helps ensure optimal performance and quality for all users.`,
          type: 'warning'
        });
      } else if (error.code === 'preset_not_found') {
        setErrorModal({
          isOpen: true,
          title: 'Preset Not Available',
          message: `🚫 The selected preset is no longer available.

Please try a different preset from our gallery.`,
          type: 'error'
        });
      } else {
        // Generic error handling
        setErrorModal({
          isOpen: true,
          title: 'Generation Failed',
          message: `An error occurred while generating the image:\n\n${error.message || 'Unknown error'}\n\nPlease try again or contact support if the problem persists.`,
          type: 'error'
        });
      }
    } finally {
      setIsGenerating(false);
      // Reset jobStatus on error so button returns to idle state
      if (jobStatus !== 'COMPLETED') {
        setTimeout(() => setJobStatus(''), 2000);
      }
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      let downloadUrl: string;
      let blob: Blob;

      // Check if it's a data URL (base64)
      if (imageUrl.startsWith('data:')) {
        // Convert data URL to blob directly
        const response = await fetch(imageUrl);
        blob = await response.blob();
        downloadUrl = window.URL.createObjectURL(blob);
      } else {
        // Use proxy API to handle CORS-protected URLs
        const proxyUrl = `/api/download?url=${encodeURIComponent(imageUrl)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`Download failed: ${response.status}`);
        }

        blob = await response.blob();
        downloadUrl = window.URL.createObjectURL(blob);
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `pixelglow-${preset}-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDownloadSelected = () => {
    if (selectedGeneratedImage) {
      const index = generatedImages.findIndex(img => img.url === selectedGeneratedImage);
      if (index !== -1) {
        handleDownload(selectedGeneratedImage, index);
      }
    }
  };

  // Loading state
  if (!isLoaded || isLoadingPreset || !isDbUserLoaded) {
    return (
      <div className="flex-1 bg-content-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isLoadingPreset ? 'Loading preset...' : !isDbUserLoaded ? 'Setting up user...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Loading state - wait for preset and images to load
  if (isLoadingPreset || (presetData && !areImagesLoaded)) {
    return (
      <div className="flex-1 bg-content-bg flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-card-foreground">Loading Studio</h2>
            <p className="text-muted-foreground">
              {isLoadingPreset ? 'Loading preset...' : 'Preparing images...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Preset not found state
  if (!presetData) {
    return (
      <div className="flex-1 bg-content-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Preset Not Found</h2>
          <p className="text-muted-foreground mb-4">The preset "{preset}" could not be found.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!clerkUser || !dbUser) {
    return (
      <div className="flex-1 bg-content-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Please sign in</h2>
          <p className="text-muted-foreground">You need to be signed in to use the image generation features.</p>
        </div>
      </div>
    );
  }

  const creditsRequired = presetData.credits;

  // Get aspect ratio of selected generated image
  const selectedImageAspectRatio = selectedGeneratedImage
    ? generatedImages.find(img => img.url === selectedGeneratedImage)?.aspectRatio || null
    : null;

  return (
    <div className="flex-1 bg-content-bg select-none">
      <div className="mx-auto max-w-7xl px-0 sm:px-6 py-0 sm:py-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">


          {/* LEFT SECTION: Preview & Info */}
          <div className="lg:col-span-3 space-y-6 px-3 sm:px-0">

            {/* Dynamic Before/After Slider */}
            <DynamicSlider
              presetData={presetData}
              selectedGeneratedImage={selectedGeneratedImage}
              onDownloadGenerated={handleDownloadSelected}
              generatedImageAspectRatio={selectedImageAspectRatio}
              exampleTransformations={exampleTransformations}
            />

            {/* Generated Images */}
            <GeneratedImagesDisplay
              images={generatedImages}
              onDownload={handleDownload}
              className="bg-card border border-border rounded-2xl"
            />
          </div>


          {/* RIGHT SECTION: Upload & Inputs */}
          <div
            className="lg:col-span-2 lg:h-screen lg:sticky lg:top-0 overflow-y-auto [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/80 [&::-webkit-scrollbar-thumb:active]:bg-primary"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--primary) / 0.6) hsl(var(--muted) / 0.2)',
            }}
          >

            <div className='space-y-4 sm:space-y-6 py-3 sm:py-6 px-3 sm:px-0 lg:pl-6 lg:pr-1 lg:mr-3'>
              {/* Upload Box */}
              <div className="space-y-4">
                {selectedImage ? (
                  <div className="relative group">
                    <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden border border-border">
                      <img
                        src={selectedImage}
                        alt="Selected image"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Change Image Button */}
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-primary hover:bg-primary/90 text-primary-foreground px-2 sm:px-3 py-1 sm:py-2 rounded-full transition-colors flex items-center gap-1 sm:gap-2 shadow-lg"
                    >
                      <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm font-medium">Change</span>
                    </button>

                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      ✓ Selected Image
                    </div>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-border rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center text-muted-foreground bg-card/30 hover:bg-card/50 transition-all cursor-pointer"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <Upload className="mx-auto h-10 w-10 sm:h-14 sm:w-14 text-muted-foreground mb-4 sm:mb-6" />
                    <p className="text-base sm:text-lg font-medium text-card-foreground mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">PNG, JPG, or WEBP (Max 10MB)</p>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Or select from <span className="text-primary font-medium">previously used images</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>


              {/* Input Fields */}
              <div className="space-y-6">
                {presetData.inputFields?.map((field: any, index: number) => {
                  const fieldKey = field.name || `input_${index}`;
                  const fieldValue = fieldKey in inputValues ? inputValues[fieldKey] : (field.defaultValue || '');

                  return field.type === 'number' ? (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-medium text-sidebar-foreground">
                        {field.label} {field.required && <span className="text-destructive">*</span>}
                      </label>
                      <input
                        type="number"
                        placeholder={field.placeholder}
                        value={fieldValue}
                        onChange={(e) => setInputValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                  ) : (
                    <Input
                      key={index}
                      label={field.label}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={fieldValue}
                      onChange={(value) => setInputValues(prev => ({ ...prev, [fieldKey]: value }))}
                    />
                  );
                }) || []}
                <Textarea
                  label="Other Ideas (Optional)"
                  placeholder="Share any additional creative ideas for your image transformation"
                  value={otherIdeas}
                  onChange={setOtherIdeas}
                />
              </div>


              {/* Generate Button */}
              <div className="space-y-4">
                <StatefulButton
                  onClick={handleGenerate}
                  disabled={!selectedImage || isGenerating || !areRequiredFieldsFilled()}
                  disabledTooltip={!selectedImage ? "Please upload an image before generation" : undefined}
                  status={
                    jobStatus === 'COMPLETED' ? 'completed' :
                    jobStatus === 'FAILED' ? 'failed' :
                    jobStatus === 'RUNNING' ? 'running' :
                    jobStatus === 'QUEUED' ? 'queued' :
                    jobStatus === 'PENDING' ? 'loading' :
                    'idle'
                  }
                >
                  Generate <Sparkles className="h-5 w-5" />
                  <span className="text-primary-foreground/70 text-xs sm:text-sm ml-1">({creditsRequired} credits)</span>
                </StatefulButton>
              </div>
            </div>
          </div>

        </div>

        {/* Style Examples Gallery - Full Width Masonry Layout */}
        <div className="mt-8 sm:mt-12 space-y-4 sm:space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground">Style Inspiration Gallery</h2>
            <p className="text-base sm:text-lg text-muted-foreground">Discover the endless possibilities of AI transformations</p>
          </div>

          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 sm:gap-4 space-y-2 sm:space-y-4 w-full">
            {(() => {
              // Define images array - length controls number of cards
              const imageUrls = [
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=450&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=650&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=480&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=520&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=580&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=470&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=550&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=650&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=480&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=580&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=450&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=480&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=520&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&h=450&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=550&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=500&fit=crop&crop=face'
              ];


              // Varied heights for organic masonry layout like Pinterest/reference
              const heights = ['h-64', 'h-80', 'h-72', 'h-88', 'h-96', 'h-76'];
              const colors = [
                'from-blue-500 to-purple-500',
                'from-pink-500 to-red-500',
                'from-green-500 to-teal-500',
                'from-purple-500 to-indigo-500',
                'from-amber-500 to-orange-500',
                'from-cyan-500 to-blue-500',
                'from-red-500 to-pink-500',
                'from-rose-500 to-pink-500',
                'from-yellow-500 to-red-500',
                'from-gray-500 to-slate-600',
                'from-indigo-500 to-purple-600',
                'from-emerald-500 to-green-600'
              ];

              return imageUrls.map((imageUrl, index) => {
                // Create organic masonry layout with varied heights
                // Use index-based distribution for consistent but varied heights
                const cardHeight = heights[index % heights.length];
                const badgeColor = colors[index % colors.length];

                return (
                  <div
                    key={index}
                    className="break-inside-avoid mb-2 sm:mb-4 w-full"
                  >
                    <div className={`group relative ${cardHeight} rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20`}>
                      <img
                        src={imageUrl}
                        alt={`Style example ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading={index < 6 ? "eager" : "lazy"}
                      />

                      {/* Base gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-300" />

                      {/* Animated gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-purple-900/20 group-hover:via-transparent group-hover:to-transparent transition-all duration-500`} />





                      {/* Enhanced Style Title */}
                      {/* <div className="absolute bottom-3 left-3 right-3 transform transition-all duration-300 group-hover:bottom-4">
                        <h3 className="text-white font-bold text-sm drop-shadow-lg transition-all duration-300 group-hover:text-lg group-hover:drop-shadow-2xl">
                          {styleNames[index % styleNames.length]}
                        </h3>
                        <div className="h-0 group-hover:h-4 transition-all duration-300 overflow-hidden">
                          <p className="text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            Click to transform your photo
                          </p>
                        </div>
                      </div> */}

                      {/* Enhanced border with glow effect */}
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-white/10 group-hover:border-white/40 transition-all duration-300" />

                      {/* Glowing border effect */}
                      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-transparent bg-gradient-to-r ${badgeColor} opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
                        style={{
                          background: `linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          maskComposite: 'xor',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor'
                        }} />

                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12" />
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Gradient fade-out at bottom for polished effect */}
          <div className="relative">
            <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-content-bg via-content-bg/80 to-transparent pointer-events-none z-10" />
          </div>


        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImageSelect={handleImageSelect}
        onAwsUpload={handleAwsFileUpload}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        preloadedImages={userImages}
        onRefreshImages={refreshUserImages}
      />

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={viewingImage}
              alt="Generated image full view"
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
              <button
                onClick={() => {
                  const index = generatedImages.findIndex(img => img.url === viewingImage);
                  if (index !== -1) handleDownload(viewingImage, index);
                }}
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
        title={errorModal.title}
        message={errorModal.message}
        type={errorModal.type}
        actionButton={errorModal.actionButton}
      />
    </div>
  );
}