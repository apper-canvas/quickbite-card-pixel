import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import ApperIcon from '../ApperIcon'
import { toast } from 'sonner'

const PhotoUpload = ({ onPhotosChange, maxFiles = 5, existingPhotos = [] }) => {
  const [photos, setPhotos] = useState(existingPhotos)

  const onDrop = useCallback((acceptedFiles) => {
    if (photos.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} photos allowed`)
      return
    }

    const newPhotos = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }))

    const updatedPhotos = [...photos, ...newPhotos]
    setPhotos(updatedPhotos)
    onPhotosChange(updatedPhotos)
    toast.success(`${newPhotos.length} photo(s) added`)
  }, [photos, maxFiles, onPhotosChange])

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId)
    setPhotos(updatedPhotos)
    onPhotosChange(updatedPhotos)
    toast.success('Photo removed')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - photos.length,
    disabled: photos.length >= maxFiles
  })

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {photos.length < maxFiles && (
        <Card 
          {...getRootProps()} 
          className={`p-6 border-2 border-dashed cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-orange-500 bg-orange-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <ApperIcon 
              name="Camera" 
              className="mx-auto h-12 w-12 text-gray-400 mb-4" 
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {isDragActive ? 'Drop photos here' : 'Add photos to your review'}
              </p>
              <p className="text-xs text-gray-500">
                Drag & drop or click to select • Max {maxFiles} photos • JPEG, PNG, WebP
              </p>
              <p className="text-xs text-gray-400">
                {photos.length}/{maxFiles} photos uploaded
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Photo Previews */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Uploaded Photos ({photos.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={photo.preview || photo.url}
                    alt={photo.name || 'Review photo'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Remove button */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(photo.id)}
                >
                  <ApperIcon name="X" className="h-3 w-3" />
                </Button>

                {/* Photo info */}
                <div className="mt-1">
                  <p className="text-xs text-gray-500 truncate">
                    {photo.name}
                  </p>
                  {photo.size && (
                    <p className="text-xs text-gray-400">
                      {(photo.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {photos.length >= maxFiles && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Maximum number of photos reached ({maxFiles})
          </p>
        </div>
      )}
    </div>
  )
}

export default PhotoUpload