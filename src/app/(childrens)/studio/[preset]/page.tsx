'use client'

import { ChevronLeft, X, Upload, ImageIcon, Camera, FolderOpen, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useDbUser } from '@/hooks/useDbUser'
import { OUTPUT_SIZES } from '@/lib/constants'
import { uploadOnly, validateFile, confirmUpload } from '@/lib/upload'
import GeneratedImagesDisplay from '@/components/GeneratedImagesDisplay'
import ErrorModal from '@/components/ErrorModal'
import { UserImage } from '@/types/user'
import { BeforeAfterSlider } from '@/components/studio/BeforeAfterSlider'
import { ExampleSwitcher, type StudioExample } from '@/components/studio/ExampleSwitcher'
import { CreatePanel, type StudioInputField } from '@/components/studio/CreatePanel'
import './studio.css'

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

// Upload Modal Component - "Upload New" / "Previous Images"
const UploadModal = ({
  isOpen,
  onClose,
  onImageSelect,
  onAwsUpload,
  isUploading,
  uploadProgress,
  preloadedImages,
  onRefreshImages,
  initialTab = 'upload',
}: {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageData: string | { displayUrl: string; s3Key: string }) => void;
  onAwsUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  preloadedImages: UserImage[];
  onRefreshImages: () => void;
  initialTab?: 'upload' | 'gallery';
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>(initialTab);
  const [dragOver, setDragOver] = useState(false);
  const [userImages, setUserImages] = useState<UserImage[]>(preloadedImages);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  useEffect(() => {
    setUserImages(preloadedImages);
  }, [preloadedImages]);

  const fetchUserImages = async () => {
    if (preloadedImages.length > 0) return;

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

  useEffect(() => {
    if (isOpen && activeTab === 'gallery' && preloadedImages.length === 0) {
      fetchUserImages();
    }
  }, [isOpen, activeTab, preloadedImages.length]);

  const handleFileUpload = async (file: File) => {
    await onAwsUpload(file);
    onRefreshImages();
  };

  const handleImageSelection = (image: UserImage) => {
    onImageSelect({
      displayUrl: image.displayUrl || image.thumbnailDisplayUrl || '',
      s3Key: image.url
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
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Select Image</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

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

        <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[60vh]">
          {activeTab === 'upload' && (
            <div className="space-y-6">
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
                        onError={() => {
                          setImageErrors(prev => new Set(prev).add(image.id));
                        }}
                        onLoad={() => {
                          setImageErrors(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(image.id);
                            return newSet;
                          });
                        }}
                      />

                      {imageErrors.has(image.id) && (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-xs">Image not available</p>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Eye className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">Select Image</p>
                        </div>
                      </div>

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

export default function StudioPage() {
  const params = useParams();
  const preset = params.preset as string;
  const { user: clerkUser, isLoaded } = useUser();
  const { user: dbUser, isLoaded: isDbUserLoaded, refetchUser } = useDbUser();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadModalTab, setUploadModalTab] = useState<'upload' | 'gallery'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageS3Key, setSelectedImageS3Key] = useState<string | null>(null);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{ name: string; size: number } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ url: string, aspectRatio: string }[]>([]);
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedOutputSize] = useState<keyof typeof OUTPUT_SIZES>('SQUARE');
  const [presetData, setPresetData] = useState<any>(null);
  const [isLoadingPreset, setIsLoadingPreset] = useState(true);
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);
  const [exampleTransformations, setExampleTransformations] = useState<Array<{ before: string, after: string, title: string }>>([]);
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [otherIdeas, setOtherIdeas] = useState<string>('');
  const [jobStatus, setJobStatus] = useState('')

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

  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Fetch gallery images for the "Style Inspiration Gallery" masonry section
  useEffect(() => {
    const fetchGalleryImages = async () => {
      if (!presetData?.id) return;

      try {
        const response = await fetch(`/api/gallery/preset-images?presetId=${presetData.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.images) {
            setGalleryImages(data.images);
          }
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
    };

    fetchGalleryImages();
  }, [presetData?.id]);

  // Fetch existing generations on page load
  useEffect(() => {
    const fetchExistingGenerations = async () => {
      if (!isLoaded || !clerkUser || !presetData?.id) return;

      try {
        const response = await fetch(`/api/generations?presetId=${presetData.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.generations && data.generations.length > 0) {
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
        setPresetData(result.preset);
        setExampleTransformations(result.transformations);

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
        const response = await fetch('/api/uploads/user-images?limit=20');
        if (response.ok) {
          const data = await response.json();

          if (data.images.length > 0) {
            const keys = data.images.map((img: UserImage) => img.url);
            const presignResponse = await fetch('/api/gallery/presign', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ keys })
            });

            if (presignResponse.ok) {
              const { urls } = await presignResponse.json();
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
        console.error('Error loading user images in background:', error);
      }
    };

    loadUserImages();
  }, [isLoaded, clerkUser]);

  const refreshUserImages = async () => {
    if (!isLoaded || !clerkUser) return;

    try {
      const response = await fetch('/api/uploads/user-images?limit=20');
      if (response.ok) {
        const data = await response.json();

        if (data.images.length > 0) {
          const keys = data.images.map((img: UserImage) => img.url);
          const presignResponse = await fetch('/api/gallery/presign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keys })
          });

          if (presignResponse.ok) {
            const { urls } = await presignResponse.json();
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

  // Preload example images after preset data loads
  useEffect(() => {
    if (!presetData || isLoadingPreset) return;

    const preloadImages = async () => {
      try {
        if (exampleTransformations.length === 0) {
          setAreImagesLoaded(true);
          return;
        }

        const allImageUrls = exampleTransformations.flatMap((item) =>
          [item.before, item.after].filter(Boolean)
        );

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
        setAreImagesLoaded(true);
      } catch (error) {
        console.error('Failed to preload images:', error);
        setAreImagesLoaded(true);
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
      setSelectedImage(imageData);
      setSelectedFileMeta(null);
    } else {
      setSelectedImage(imageData.displayUrl);
      setSelectedImageS3Key(imageData.s3Key);
      setSelectedFileMeta(null);
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

    const validation = validateFile(file);
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
      await uploadOnly({
        file,
        onProgress: (progress: number) => {
          setUploadProgress(progress);
        },
        onSuccess: async (s3Key: string) => {
          setUploadProgress(100);

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
                width: 1024,
                height: 1024,
              }),
            });

            if (saveResponse.ok) {
              await saveResponse.json();

              const presignResponse = await fetch('/api/gallery/presign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keys: [s3Key] })
              });

              if (presignResponse.ok) {
                const { urls } = await presignResponse.json();
                const urlData = urls[0];
                if (urlData.success) {
                  setSelectedImage(urlData.url);
                  setSelectedImageS3Key(s3Key);
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

      setIsUploadModalOpen(false);
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

  const handleFileSelected = (file: File) => {
    setSelectedFileMeta({ name: file.name, size: file.size });
    handleAwsFileUpload(file);
  };

  // "Try the example above" - runs the current example's before-photo through the
  // same upload pipeline as a manual upload, via the existing download proxy to
  // dodge CORS on the (public) example asset.
  const handleTryExample = async () => {
    const example = exampleTransformations[activeExampleIndex];
    if (!example) return;

    try {
      const proxyUrl = `/api/download?url=${encodeURIComponent(example.before)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`Failed to load example: ${response.status}`);
      const blob = await response.blob();
      const file = new File([blob], `example-${activeExampleIndex + 1}.jpg`, { type: blob.type || 'image/jpeg' });
      setSelectedFileMeta({ name: `Sample · Example ${activeExampleIndex + 1}`, size: file.size });
      await handleAwsFileUpload(file);
    } catch (error) {
      console.error('Failed to load example image:', error);
      setErrorModal({
        isOpen: true,
        title: 'Could Not Load Example',
        message: 'We couldn\'t load the sample image. Please try uploading your own photo instead.',
        type: 'error'
      });
    }
  };

  const areRequiredFieldsFilled = () => {
    if (!presetData || !presetData.inputFields || presetData.inputFields.length === 0) {
      return true;
    }

    return presetData.inputFields.every((field: any) => {
      if (!field.required) return true;

      const fieldKey = field.name || `input_${presetData.inputFields.indexOf(field)}`;
      const userValue = inputValues[fieldKey];
      const hasDefault = field.defaultValue && field.defaultValue.trim() !== '';

      return (userValue && userValue.trim() !== '') || hasDefault;
    });
  };

  const pollForCompletion = async (jobId: string, selectedOutputSize: keyof typeof OUTPUT_SIZES) => {
    const maxAttempts = 60;
    let attempts = 0;

    setIsGenerating(true);

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`/api/generations/${jobId}`);
        const result = await response.json();

        setJobStatus(result.status);

        if (result.status === 'COMPLETED' && result.outputUrl) {
          const selectedAspectRatio = OUTPUT_SIZES[selectedOutputSize].aspectRatio;

          const newGeneratedImage = {
            url: result.outputUrl,
            aspectRatio: selectedAspectRatio
          };

          setGeneratedImages(prev => [newGeneratedImage, ...prev]);
          setSelectedGeneratedImage(result.outputUrl);

          await refetchUser();

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

        await new Promise(resolve => setTimeout(resolve, 5000));
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
    setJobStatus('PENDING');

    try {
      const finalInputValues: Record<string, string> = {};

      if (presetData.inputFields && presetData.inputFields.length > 0) {
        presetData.inputFields.forEach((field: any, index: number) => {
          const fieldKey = field.name || `input_${index}`;
          const userValue = inputValues[fieldKey];

          finalInputValues[fieldKey] = (userValue && userValue.trim() !== '')
            ? userValue
            : (field.defaultValue || '');
        });
      }

      if (otherIdeas.trim() !== '') {
        finalInputValues['additional_ideas'] = otherIdeas.trim();
      }

      const confirmResult = await confirmUpload({
        s3Key: selectedImageS3Key,
        presetId: presetData.id,
        inputValues: finalInputValues,
        outputSize: selectedOutputSize,
      });

      if (confirmResult.jobId) {
        await pollForCompletion(confirmResult.jobId, selectedOutputSize);
      } else {
        throw new Error('No job ID returned from confirm upload');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);

      if (error.code === 'insufficient_credits') {
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
              window.open('/pricing', '_blank');
            }
          }
        });
      } else if (error.code === 'too_many_in_flight') {
        const checkStuckJobs = async () => {
          try {
            const response = await fetch('/api/generations/stuck');
            const data = await response.json();

            if (data.count > 0 && data.stuck) {
              const formatTimeAgo = (date: string) => {
                const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
                if (minutes < 60) return `${minutes} min ago`;
                const hours = Math.floor(minutes / 60);
                return `${hours} hour${hours > 1 ? 's' : ''} ago`;
              };

              const stuckJobsList = data.stuck.map((job: any) =>
                `• ${job.preset.title} (${job.status}) - Started ${formatTimeAgo(job.createdAt)}`
              ).join('\n');

              setErrorModal({
                isOpen: true,
                title: 'Too Many Active Generations',
                message: `⏳ You have ${data.count} generation(s) that may be stuck.

📋 Stuck Jobs:
${stuckJobsList}

These jobs have been pending for more than 10 minutes and are likely failed. You can cancel them to free up your generation slots.`,
                type: 'warning',
                actionButton: {
                  text: 'Cancel Stuck Jobs',
                  onClick: async () => {
                    try {
                      const deleteResponse = await fetch('/api/generations/stuck', {
                        method: 'DELETE',
                      });
                      const result = await deleteResponse.json();

                      if (result.success) {
                        setErrorModal({
                          isOpen: true,
                          title: 'Jobs Cancelled',
                          message: `✅ Successfully cancelled ${result.count} stuck job(s).

You can now create new generations!`,
                          type: 'info'
                        });
                      } else {
                        throw new Error(result.error || 'Failed to cancel jobs');
                      }
                    } catch (error) {
                      console.error('Failed to cancel stuck jobs:', error);
                      setErrorModal({
                        isOpen: true,
                        title: 'Error',
                        message: 'Failed to cancel stuck jobs. Please try again or contact support.',
                        type: 'error'
                      });
                    }
                  }
                }
              });
            } else {
              setErrorModal({
                isOpen: true,
                title: 'Too Many Active Generations',
                message: `⏳ You have too many generations in progress.

Please wait for them to complete before starting a new one.

This helps ensure optimal performance and quality for all users.`,
                type: 'warning'
              });
            }
          } catch (error) {
            console.error('Failed to check stuck jobs:', error);
            setErrorModal({
              isOpen: true,
              title: 'Too Many Active Generations',
              message: `⏳ You have too many generations in progress.

Please wait for them to complete before starting a new one.

This helps ensure optimal performance and quality for all users.`,
              type: 'warning'
            });
          }
        };

        checkStuckJobs();
      } else if (error.code === 'preset_not_found') {
        setErrorModal({
          isOpen: true,
          title: 'Preset Not Available',
          message: `🚫 The selected preset is no longer available.

Please try a different preset from our gallery.`,
          type: 'error'
        });
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Generation Failed',
          message: `An error occurred while generating the image:\n\n${error.message || 'Unknown error'}\n\nPlease try again or contact support if the problem persists.`,
          type: 'error'
        });
      }
    } finally {
      setIsGenerating(false);
      if (jobStatus !== 'COMPLETED') {
        setTimeout(() => setJobStatus(''), 2000);
      }
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      let downloadUrl: string;
      let blob: Blob;

      if (imageUrl.startsWith('data:')) {
        const response = await fetch(imageUrl);
        blob = await response.blob();
        downloadUrl = window.URL.createObjectURL(blob);
      } else {
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

  // Loading states
  if (!isLoaded || isLoadingPreset || !isDbUserLoaded) {
    return (
      <div className="studio-redesign flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--red)] mx-auto mb-4"></div>
          <p className="text-[var(--fog)]">
            {isLoadingPreset ? 'Loading preset...' : !isDbUserLoaded ? 'Setting up user...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingPreset || (presetData && !areImagesLoaded)) {
    return (
      <div className="studio-redesign flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--red)] border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[var(--paper)]">Loading Studio</h2>
            <p className="text-[var(--fog)]">
              {isLoadingPreset ? 'Loading preset...' : 'Preparing images...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!presetData) {
    return (
      <div className="studio-redesign flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--paper)] mb-4">Preset Not Found</h2>
          <p className="text-[var(--fog)] mb-4">The preset &quot;{preset}&quot; could not be found.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-[var(--red)] text-white rounded-lg hover:bg-[var(--red-deep)] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!clerkUser || !dbUser) {
    return (
      <div className="studio-redesign flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--paper)] mb-4">Please sign in</h2>
          <p className="text-[var(--fog)]">You need to be signed in to use the image generation features.</p>
        </div>
      </div>
    );
  }

  const creditsRequired = presetData.credits;

  const examples: StudioExample[] = exampleTransformations.map((t, i) => ({
    id: String(i),
    label: `Example ${i + 1}`,
    before: t.before,
    after: t.after,
  }));
  const activeExample = examples[activeExampleIndex];

  const heroAfterSrc = selectedGeneratedImage || activeExample?.after;
  const heroBeforeSrc = activeExample?.before;

  const chips: { label: string; accent?: boolean }[] = [];
  if (presetData.badge) chips.push({ label: presetData.badge, accent: true });
  if (presetData.category) chips.push({ label: presetData.category });
  chips.push({ label: `${creditsRequired} credit${creditsRequired !== 1 ? 's' : ''}` });

  return (
    <div className="studio-redesign min-h-screen">
      <div className="studio-container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link
          href="/studio"
          className="inline-flex items-center gap-1 text-sm text-[var(--fog)] hover:text-[var(--paper)] transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" /> All presets
        </Link>

        <div className="studio-grid">
          {/* LEFT: demo */}
          <div className="space-y-5">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--paper)] leading-tight">
                {presetData.title}
              </h1>
              <p className="text-base sm:text-lg text-[var(--fog)] max-w-2xl">
                {presetData.description}
              </p>
            </div>

            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <span key={i} className={`studio-chip ${chip.accent ? 'studio-chip-accent' : ''}`}>
                    {chip.label}
                  </span>
                ))}
              </div>
            )}

            {heroBeforeSrc && heroAfterSrc ? (
              <div className="relative">
                <BeforeAfterSlider
                  beforeSrc={heroBeforeSrc}
                  afterSrc={heroAfterSrc}
                  priority
                />
                {selectedGeneratedImage && (
                  <button
                    onClick={handleDownloadSelected}
                    className="absolute top-3 right-3 z-30 bg-[var(--red)] hover:bg-[var(--red-deep)] text-white p-2.5 rounded-full shadow-lg transition-colors flex items-center gap-2"
                    title="Download generated image"
                  >
                    <span className="text-xs font-medium">Download</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="studio-panel aspect-[4/3] flex items-center justify-center">
                <p className="text-sm text-[var(--fog)]">No example available yet for this preset.</p>
              </div>
            )}

            {heroBeforeSrc && (
              <p className="text-sm text-[var(--fog)]">
                Drag the handle to compare. This is a live example — your photo goes in on the right.
              </p>
            )}

            <ExampleSwitcher
              examples={examples}
              activeId={activeExample?.id ?? ''}
              onSelect={(example) => {
                setActiveExampleIndex(Number(example.id));
                setSelectedGeneratedImage(null);
              }}
            />
          </div>

          {/* RIGHT: create panel */}
          <CreatePanel
            selectedImage={selectedImage}
            selectedFileName={selectedFileMeta?.name}
            selectedFileSize={selectedFileMeta?.size}
            onFileSelected={handleFileSelected}
            onOpenPreviousImages={() => {
              setUploadModalTab('gallery');
              setIsUploadModalOpen(true);
            }}
            onTryExample={handleTryExample}
            canTryExample={!!activeExample}
            inputFields={(presetData.inputFields || []) as StudioInputField[]}
            inputValues={inputValues}
            onInputChange={(key, value) => setInputValues(prev => ({ ...prev, [key]: value }))}
            otherIdeas={otherIdeas}
            onOtherIdeasChange={setOtherIdeas}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            jobStatus={jobStatus}
            creditsRequired={creditsRequired}
            canGenerate={areRequiredFieldsFilled()}
          />
        </div>

        {/* Results */}
        <div className="mt-10 sm:mt-14">
          <GeneratedImagesDisplay
            images={generatedImages}
            onDownload={handleDownload}
            className="!bg-[var(--graphite)] !border !border-[var(--line)] rounded-2xl"
            gridClassName="studio-gallery-grid"
          />
        </div>

        <div className="mt-10 sm:mt-14 border-t border-[var(--line)]" />

        {/* Style Inspiration Gallery - Full Width Masonry Layout */}
        <div className="mt-10 sm:mt-14 space-y-4 sm:space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--paper)]">Style Inspiration Gallery</h2>
            <p className="text-base sm:text-lg text-[var(--fog)]">Discover the endless possibilities of AI transformations</p>
          </div>

          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 sm:gap-4 space-y-2 sm:space-y-4 w-full">
            {(() => {
              const totalSlots = 20;
              const displayItems = Array.from({ length: totalSlots }, (_, index) => {
                if (index < galleryImages.length) {
                  return { type: 'image', url: galleryImages[index] };
                } else {
                  return { type: 'placeholder' };
                }
              });

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

              return displayItems.map((item, index) => {
                const cardHeight = heights[index % heights.length];
                const badgeColor = colors[index % colors.length];

                return (
                  <div key={index} className="break-inside-avoid mb-2 sm:mb-4 w-full">
                    <div className={`group relative ${cardHeight} rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20`}>
                      {item.type === 'image' && item.url ? (
                        <img
                          src={item.url}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading={index < 6 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse backdrop-blur-md" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-300" />
                      <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-purple-900/20 group-hover:via-transparent group-hover:to-transparent transition-all duration-500`} />
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-white/10 group-hover:border-white/40 transition-all duration-300" />
                      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-transparent bg-gradient-to-r ${badgeColor} opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
                        style={{
                          background: `linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          maskComposite: 'xor',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor'
                        }} />
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12" />
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/80 to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>

      <UploadModal
        key={uploadModalTab}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImageSelect={handleImageSelect}
        onAwsUpload={handleAwsFileUpload}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        preloadedImages={userImages}
        onRefreshImages={refreshUserImages}
        initialTab={uploadModalTab}
      />

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
