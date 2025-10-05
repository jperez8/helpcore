import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Ticket, 
  Message, 
  User, 
  ActivityLog,
  InsertTicket,
  InsertMessage
} from '@shared/schema';

interface TicketFilters {
  status?: string;
  priority?: string;
  assigneeId?: string;
  channel?: string;
}

interface TicketWithMessages {
  ticket: Ticket;
  messages: Message[];
  activityLogs: ActivityLog[];
}

interface AuthResponse {
  user: any;
  session: any;
}

interface CreateTicketRequest extends InsertTicket {
  initialMessage?: string;
}

interface UpdateStatusRequest {
  status: string;
  actorName: string;
  actorId?: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('supabase_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Tickets', 'Ticket', 'Users', 'Activity'],
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, { email: string; password: string; fullName?: string }>({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getSession: builder.query<{ user: any }, void>({
      query: () => '/auth/session',
    }),
    getTickets: builder.query<Ticket[], TicketFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId);
        if (filters?.channel) params.append('channel', filters.channel);
        return `/tickets?${params.toString()}`;
      },
      providesTags: ['Tickets'],
    }),
    getTicketById: builder.query<TicketWithMessages, string>({
      query: (id) => `/tickets/${id}`,
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),
    createTicket: builder.mutation<Ticket, CreateTicketRequest>({
      query: (ticket) => ({
        url: '/tickets',
        method: 'POST',
        body: ticket,
      }),
      invalidatesTags: ['Tickets', 'Activity'],
    }),
    addMessage: builder.mutation<Message, { ticketId: string; message: InsertMessage }>({
      query: ({ ticketId, message }) => ({
        url: `/tickets/${ticketId}/messages`,
        method: 'POST',
        body: message,
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: 'Ticket', id: ticketId },
        'Activity',
      ],
    }),
    updateTicketStatus: builder.mutation<Ticket, { id: string; update: UpdateStatusRequest }>({
      query: ({ id, update }) => ({
        url: `/tickets/${id}/status`,
        method: 'PATCH',
        body: update,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Ticket', id },
        'Tickets',
        'Activity',
      ],
    }),
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    getActivity: builder.query<ActivityLog[], { limit?: number } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        return `/activity?${searchParams.toString()}`;
      },
      providesTags: ['Activity'],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetSessionQuery,
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useAddMessageMutation,
  useUpdateTicketStatusMutation,
  useGetUsersQuery,
  useGetActivityQuery,
} = api;
