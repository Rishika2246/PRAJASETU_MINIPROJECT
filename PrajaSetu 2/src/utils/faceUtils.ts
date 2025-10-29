// Face storage and comparison utilities
export interface FaceData {
  id: string;
  imageData: string;
  timestamp: string;
  userId: string;
}

class FaceStorage {
  private storageKey = 'voting-faces';
  private faces: Map<string, FaceData> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.faces = new Map(data);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      const data = JSON.stringify(Array.from(this.faces.entries()));
      localStorage.setItem(this.storageKey, data);
    }
  }

  async saveFace(userId: string, imageData: string): Promise<string> {
    const faceId = `face_${userId}_${Date.now()}`;
    const faceData: FaceData = {
      id: faceId,
      imageData,
      timestamp: new Date().toISOString(),
      userId
    };

    this.faces.set(faceId, faceData);
    this.saveToStorage();
    
    // Also save to file system in development (simulated)
    await this.saveFaceToFile(faceData);
    
    return faceId;
  }

  async getFaceByUserId(userId: string): Promise<FaceData | null> {
    // Find the most recent face for this user
    const userFaces = Array.from(this.faces.values())
      .filter(face => face.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return userFaces[0] || null;
  }

  async getAllFaces(): Promise<FaceData[]> {
    return Array.from(this.faces.values());
  }

  private async saveFaceToFile(faceData: FaceData): Promise<void> {
    // In a real application, this would save to your backend
    // For demo purposes, we'll simulate file storage
    try {
      // Simulate API call to save face image
      console.log('Saving face image to server:', faceData.id);
      
      // In production, you would send the image data to your backend:
      // await fetch('/api/faces/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(faceData)
      // });
      
    } catch (error) {
      console.error('Failed to save face to file:', error);
    }
  }

  async compareFaces(face1: FaceData, face2: FaceData): Promise<{ match: boolean; confidence: number }> {
    // Simple image comparison (in real app, use face recognition API)
    return this.simulateFaceComparison(face1.imageData, face2.imageData);
  }

  private async simulateFaceComparison(image1: string, image2: string): Promise<{ match: boolean; confidence: number }> {
    // Simulate face comparison with 80% success rate for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple comparison based on image data similarity
    const similarity = this.calculateImageSimilarity(image1, image2);
    const confidence = Math.min(similarity * 100, 95); // Cap at 95% for realism
    const match = confidence > 70; // 70% confidence threshold
    
    return { match, confidence };
  }

  private calculateImageSimilarity(img1: string, img2: string): number {
    // Simple simulation - in real app, use proper face recognition
    // This is a placeholder that returns random-ish but consistent results
    let hash = 0;
    for (let i = 0; i < Math.min(img1.length, img2.length); i++) {
      hash = ((hash << 5) - hash) + img1.charCodeAt(i) * img2.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 100) / 100;
  }

  async validateFaceMatch(currentFaceImage: string, userId: string): Promise<{
    success: boolean;
    confidence?: number;
    message: string;
  }> {
    try {
      const storedFace = await this.getFaceByUserId(userId);
      
      if (!storedFace) {
        return {
          success: false,
          message: 'No stored face found for verification. Please complete initial face capture first.'
        };
      }

      const comparison = await this.compareFaces(
        { id: 'current', imageData: currentFaceImage, timestamp: new Date().toISOString(), userId },
        storedFace
      );

      if (comparison.match) {
        return {
          success: true,
          confidence: comparison.confidence,
          message: `Face verification successful! Confidence: ${comparison.confidence.toFixed(1)}%`
        };
      } else {
        return {
          success: false,
          confidence: comparison.confidence,
          message: `Face verification failed. Confidence: ${comparison.confidence.toFixed(1)}% (minimum 70% required)`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Face verification error. Please try again.'
      };
    }
  }
}

export const faceStorage = new FaceStorage();