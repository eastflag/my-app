export interface CreatorRegistrationFileInfo {
  fileUrl: string;
  fileSize: number;
}

export interface CreatorRegistrationRequest {
  creatorType: string;
  creatorName: string;
  introduction: string;
  fileInfo: CreatorRegistrationFileInfo[];
  contactEmailAddress: string;
}
