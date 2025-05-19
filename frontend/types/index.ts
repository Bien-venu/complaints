export interface User {
  assignedLocation: {
    province: string;
    district: string;
    sector: string;
  };
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  __v: number;
}

export interface Members {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  joinedAt: string;
  _id: number;
}

export interface Discussion {
  location: {
    province: string;
    district: string;
    sector: string;
  };
  _id: string;
  title: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  tags: string[];
  status: string;
  comments: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      id: string;
    };
    text: string;
    isOfficialResponse: boolean;
    _id: string;
    createdAt: string;
    id: string;
  }[];
  createdAt: string;
  __v: number;
  resolvedAt?: string;
  id: string;
}

export interface Analytics {
  averageRating: number;
  count: number;
  latestComments: string[];
  serviceType: string;
}

export interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  receiver: {
    _id: string;
    name: string;
    role: string;
  };
  message: string;
  status: string;
  createdAt: string;
  __v: number;
}

export interface Group {
  location: {
    province: string;
    district: string;
    sector: string;
  };
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: {
    user?: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
    _id: string;
    joinedAt: string;
  }[];
  announcements: {
    message: string;
    postedBy: string;
    _id: string;
    createdAt: string;
  }[];
  createdAt: string;
  __v: number;
}

export interface Announcement {
  message: string;
  postedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  _id: string;
  createdAt: string;
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  status: string;
  location: {
    district: string;
    sector: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  sectorAdmin?: {
    _id: string;
    name: string;
    email: string;
  };
  escalationLevel: number;
  createdAt: string;
  __v: number;
  id: string;
}


export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  role: "citizen";
  assignedLocation: {
    province: string;
    district: string;
    sector: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Location {
  sector: string;
  district: string;
}

export interface ComplaintSubmissionPayload {
  category: string;
  title: string;
  description: string;
  location: Location;
}

export interface DiscussionCreationPayload {
  title: string;
  description: string;
  tags: string[];
}

export interface CommentCreationPayload {
  text: string;
  isOfficialResponse: boolean;
}

export interface FeedbackSubmissionPayload {
  serviceType: string;
  rating: number;
  comments: string;
}

export interface AssignRolePayload {
  role: string;
  assignedLocation?: {
    province: string;
    district: string;
    sector: string;
  };
}

export interface GroupCreationPayload {
  name: string;
  description: string;
}

export interface AnnouncementCreationPayload {
  message: string;
}

export interface ReportsQuery {
  timeRange: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface Conversation {
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isLastMessageFromMe: boolean;
}
