import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch conversations
export const fetchConversations = createAsyncThunk(
    'messages/fetchConversations',
    async ({ getToken }, { rejectWithValue }) => {
        try {
            const token = await getToken();
            const response = await axios.get('/api/messages/conversations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.conversations;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch conversations');
        }
    }
);

// Fetch messages for a specific conversation
export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async ({ conversationId, getToken }, { rejectWithValue }) => {
        try {
            const token = await getToken();
            const response = await axios.get(`/api/messages/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { conversationId, messages: response.data.messages };
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages');
        }
    }
);

// Send a message
export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async ({ conversationId, body, getToken }, { rejectWithValue }) => {
        try {
            const token = await getToken();
            const response = await axios.post('/api/messages/send', { conversationId, body }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to send message');
        }
    }
);

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        conversations: [],
        activeConversationId: null,
        messagesByConversation: {}, // { [conversationId]: [message, ...] }
        status: 'idle',
        error: null,
    },
    reducers: {
        setActiveConversation: (state, action) => {
            state.activeConversationId = action.payload;
        },
        addMessageOptimistic: (state, action) => {
            const { conversationId, message } = action.payload;
            if (!state.messagesByConversation[conversationId]) {
                state.messagesByConversation[conversationId] = [];
            }
            state.messagesByConversation[conversationId].push(message);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Conversations
            .addCase(fetchConversations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Fetch Messages
            .addCase(fetchMessages.fulfilled, (state, action) => {
                const { conversationId, messages } = action.payload;
                state.messagesByConversation[conversationId] = messages;
            })
            // Send Message
            .addCase(sendMessage.fulfilled, (state, action) => {
                const message = action.payload;
                const conversationId = message.conversationId;
                if (!state.messagesByConversation[conversationId]) {
                    state.messagesByConversation[conversationId] = [];
                }
                // Avoid duplicates if optimistic update was used
                const exists = state.messagesByConversation[conversationId].find(m => m.id === message.id);
                if (!exists) {
                     state.messagesByConversation[conversationId].push(message);
                }
            });
    }
});

export const { setActiveConversation, addMessageOptimistic } = messageSlice.actions;
export default messageSlice.reducer;
