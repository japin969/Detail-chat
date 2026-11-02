package app.neon.com.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import app.neon.com.data.model.ChatMessage
import dagger.hilt.android.lifecycle.HiltViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID
import javax.inject.Inject
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

@HiltViewModel
class ChatViewModel @Inject constructor() : ViewModel() {

    companion object {
        const val NEON_AI_CHAT_ID = "neon_ai"
    }

    val currentUserId: String = "user_me"

    private val _messages = MutableStateFlow<List<ChatMessage>>(emptyList())
    val messages: StateFlow<List<ChatMessage>> = _messages.asStateFlow()

    private var activeChatId: String = ""
    private var pendingReplyMessage: ChatMessage? = null

    // Simpan pesan per chatId di memori lokal
    private val chatStore = mutableMapOf<String, MutableList<ChatMessage>>()

    init {
        seedInitialMessages()
    }

    private fun seedInitialMessages() {
        val now = System.currentTimeMillis()
        val timeFormat = SimpleDateFormat("HH:mm", Locale.getDefault())

        val auraMessages = mutableListOf(
            ChatMessage(
                msgId = "msg_aura_1",
                chatId = "chat_aura",
                senderId = "aura_123",
                senderName = "Aura Cantika",
                text = "Hai! Kamu lagi dengerin lagu apa sekarang?",
                time = timeFormat.format(Date(now - 35 * 60_000L)),
                timestamp = now - 35 * 60_000L,
                isFromMe = false,
                isRead = true
            ),
            ChatMessage(
                msgId = "msg_aura_2",
                chatId = "chat_aura",
                senderId = currentUserId,
                senderName = "Saya",
                text = "Lagi dengerin playlist lo-fi chill di Neont nih. Suasananya pas banget buat fokus coding.",
                time = timeFormat.format(Date(now - 30 * 60_000L)),
                timestamp = now - 30 * 60_000L,
                isFromMe = true,
                isRead = true
            ),
            ChatMessage(
                msgId = "msg_aura_3",
                chatId = "chat_aura",
                senderId = "aura_123",
                senderName = "Aura Cantika",
                text = "Lagu yang barusan kamu putar di Neont enak banget! 🎶",
                time = timeFormat.format(Date(now - 20 * 60_000L)),
                timestamp = now - 20 * 60_000L,
                isFromMe = false,
                isRead = true,
                reactions = mapOf(currentUserId to "❤️")
            )
        )

        val aiMessages = mutableListOf(
            ChatMessage(
                msgId = "msg_ai_1",
                chatId = NEON_AI_CHAT_ID,
                senderId = NEON_AI_CHAT_ID,
                senderName = "Neon AI",
                text = "Halo! Saya asisten Neon AI. Ada rekomendasi musik, bantuan produktivitas, atau obrolan yang ingin kamu diskusikan hari ini? ✨",
                time = timeFormat.format(Date(now - 60_000L)),
                timestamp = now - 60_000L,
                isFromMe = false,
                isRead = true
            )
        )

        chatStore["chat_aura"] = auraMessages
        chatStore[NEON_AI_CHAT_ID] = aiMessages
    }

    fun loadChat(chatId: String) {
        activeChatId = chatId
        val existing = chatStore.getOrPut(chatId) { mutableListOf() }
        _messages.value = existing.toList()
    }

    fun setReplyMessage(message: ChatMessage?) {
        pendingReplyMessage = message
    }

    fun sendMessage(chatId: String, text: String) {
        if (text.isBlank()) return

        val now = System.currentTimeMillis()
        val timeFormat = SimpleDateFormat("HH:mm", Locale.getDefault())
        val newMsg = ChatMessage(
            msgId = "msg_${UUID.randomUUID().toString().take(8)}",
            chatId = chatId,
            senderId = currentUserId,
            senderName = "Saya",
            text = text.trim(),
            time = timeFormat.format(Date(now)),
            timestamp = now,
            isFromMe = true,
            isRead = false,
            replyTo = pendingReplyMessage?.msgId
        )

        val list = chatStore.getOrPut(chatId) { mutableListOf() }
        list.add(newMsg)
        _messages.value = list.toList()
        pendingReplyMessage = null

        // Logika balasan otomatis jika mengobrol dengan Neon AI
        if (chatId == NEON_AI_CHAT_ID) {
            triggerAiResponse(text)
        }
    }

    private fun triggerAiResponse(userText: String) {
        viewModelScope.launch {
            delay(1200L) // Simulasi jeda berpikir AI
            val now = System.currentTimeMillis()
            val timeFormat = SimpleDateFormat("HH:mm", Locale.getDefault())

            val replyText = when {
                userText.contains("lagu", ignoreCase = true) || userText.contains("musik", ignoreCase = true) || userText.contains("playlist", ignoreCase = true) ->
                    "Saya rekomendasikan playlist 'Midnight Neon Vibes' atau lagu synthwave santai seperti Resonance - Home untuk menemani harimu! 🎧✨"
                userText.contains("waktu", ignoreCase = true) || userText.contains("produktif", ignoreCase = true) ->
                    "Coba teknik Pomodoro 25 menit fokus penuh, dilanjutkan istirahat 5 menit dengan alunan instrumen Neont yang menenangkan."
                userText.contains("ulang tahun", ignoreCase = true) ->
                    "\"Selamat bertambah usia! Semoga harimu penuh harmoni, kebahagiaan tak berujung, dan melodi terindah sepanjang tahun! 🎂🎉\""
                else ->
                    "Menarik sekali! Saya mencatat pertanyaanmu: \"$userText\". Ada yang ingin kamu explore lebih detail di Neont?"
            }

            val aiMsg = ChatMessage(
                msgId = "msg_ai_${UUID.randomUUID().toString().take(8)}",
                chatId = NEON_AI_CHAT_ID,
                senderId = NEON_AI_CHAT_ID,
                senderName = "Neon AI",
                text = replyText,
                time = timeFormat.format(Date(now)),
                timestamp = now,
                isFromMe = false,
                isRead = true
            )

            val list = chatStore.getOrPut(NEON_AI_CHAT_ID) { mutableListOf() }
            list.add(aiMsg)
            if (activeChatId == NEON_AI_CHAT_ID) {
                _messages.value = list.toList()
            }
        }
    }

    fun sendReaction(chatId: String, msgId: String, emoji: String) {
        val list = chatStore[chatId] ?: return
        val index = list.indexOfFirst { it.msgId == msgId }
        if (index != -1) {
            val msg = list[index]
            val currentReactions = msg.reactions.toMutableMap()
            if (currentReactions[currentUserId] == emoji) {
                currentReactions.remove(currentUserId)
            } else {
                currentReactions[currentUserId] = emoji
            }
            list[index] = msg.copy(reactions = currentReactions)
            _messages.value = list.toList()
        }
    }

    fun editMessage(chatId: String, msgId: String, newText: String) {
        if (newText.isBlank()) return
        val list = chatStore[chatId] ?: return
        val index = list.indexOfFirst { it.msgId == msgId }
        if (index != -1 && list[index].isFromMe) {
            val msg = list[index]
            list[index] = msg.copy(text = newText.trim(), isEdited = true)
            _messages.value = list.toList()
        }
    }

    fun deleteMessage(chatId: String, msgId: String, deleteForEveryone: Boolean = true) {
        val list = chatStore[chatId] ?: return
        val index = list.indexOfFirst { it.msgId == msgId }
        if (index != -1) {
            if (deleteForEveryone) {
                val msg = list[index]
                list[index] = msg.copy(isDeleted = true, text = "Pesan ini telah dihapus")
            } else {
                list.removeAt(index)
            }
            _messages.value = list.toList()
        }
    }
}
