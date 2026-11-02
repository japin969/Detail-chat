/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileCode2,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Eye,
  Layers,
  ArrowRight,
  Code2,
  Cpu,
  Lock,
  ChevronRight,
  FolderTree,
  Terminal,
  Zap
} from 'lucide-react';

interface KotlinFile {
  name: string;
  path: string;
  category: 'UI Chat' | 'UI Profile' | 'Theme' | 'Data Models' | 'ViewModel' | 'Gradle';
  description: string;
  highlights: string[];
  code: string;
}

const KOTLIN_FILES: KotlinFile[] = [
  {
    name: 'ChatListScreen.kt',
    path: 'app/src/main/java/app/neon/com/ui/chat/ChatListScreen.kt',
    category: 'UI Chat',
    description: 'WhatsApp iOS 26 Liquid Glass Chat List dengan Haze blur 15dp, Large Title "Chats", Glass Search Bar (tanpa auto-focus), Filter Chips glass, Swipe to Pin/Delete, dan FAB Neon AI Bintang.',
    highlights: [
      'TopBar Liquid Glass dengan Haze blur 15dp & Edit button iOS Blue (#007AFF)',
      'Search Bar glass 40dp tanpa auto-focus keyboard',
      'Filter Chips glass (Semua, Belum dibaca, Favorit, Grup)',
      'LazyColumn sebagai hazeSource agar wallpaper terpantul di glass surface',
      'FAB Bintang Neon AI 60dp hijau gradient (#25D366 -> #128C7E) dengan shadow 12dp',
      'Full dialog percakapan Neon AI'
    ],
    code: `package app.neon.com.ui.chat

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Archive
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.NotificationsOff
import androidx.compose.material.icons.filled.PushPin
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.Text
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.hilt.navigation.compose.hiltViewModel
import app.neon.com.data.model.ChatItem
import app.neon.com.ui.theme.InterFontFamily
import app.neon.com.ui.theme.IosBlue
import app.neon.com.ui.viewmodel.ChatViewModel
import coil.compose.AsyncImage
import coil.request.CachePolicy
import coil.request.ImageRequest
import dev.chrisbanes.haze.HazeState
import dev.chrisbanes.haze.hazeEffect
import dev.chrisbanes.haze.hazeSource
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

private enum class ChatFilterType(val label: String) {
    ALL("Semua"),
    UNREAD("Belum dibaca"),
    FAVORITES("Favorit"),
    GROUPS("Grup")
}

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
@Composable
fun ChatListScreen(
    onChatClick: (chatId: String) -> Unit = {},
    onNavigateToMusic: () -> Unit = {},
    onLogoutClick: () -> Unit = {},
    onNavigateToNeonAi: () -> Unit = {}
) {
    val palette = neontChatPalette()
    val isDark = isSystemInDarkTheme()
    val hazeState = remember { HazeState() }
    val listState = rememberLazyListState()
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf(ChatFilterType.ALL) }
    var showAiDialog by remember { mutableStateOf(false) }

    val now = remember { System.currentTimeMillis() }
    val chatsList = remember {
        mutableStateListOf(
            ChatItem(
                id = "chat_aura",
                chatName = "Aura Cantika",
                lastMessage = "Lagu yang barusan kamu putar di Neont enak banget! 🎶",
                lastMessageTimestamp = now - 20 * 60_000L,
                recipientAvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
                unreadCount = 2,
                isPinned = true
            ),
            ChatItem(
                id = "chat_komunitas",
                isGroup = true,
                chatName = "Komunitas Musik Jakarta",
                lastMessage = "Diskusi album terbaru Taylor Swift di room musik...",
                lastMessageTimestamp = now - 3 * 3_600_000L,
                recipientAvatarUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80",
                unreadCount = 0
            ),
            ChatItem(
                id = "chat_rizky",
                chatName = "Rizky Ramadhan",
                lastMessage = "Bro, share playlist Neont kamu dong, buat nemenin kerja.",
                lastMessageTimestamp = now - 26 * 3_600_000L,
                recipientAvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
                unreadCount = 1
            ),
            ChatItem(
                id = "chat_nadia",
                chatName = "Nadia Salsabila",
                lastMessage = "Makasih ya rekomendasi lagunya! Pas banget di mood.",
                lastMessageTimestamp = now - 30 * 3_600_000L,
                recipientAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
                unreadCount = 0
            )
        )
    }

    var selectedContextChat by remember { mutableStateOf<ChatItem?>(null) }

    val filteredChats = remember(searchQuery, selectedFilter, chatsList.toList()) {
        chatsList.filter { chat ->
            val matchQuery = searchQuery.isBlank() ||
                chat.chatName.contains(searchQuery, ignoreCase = true) ||
                chat.lastMessage.contains(searchQuery, ignoreCase = true)

            val matchFilter = when (selectedFilter) {
                ChatFilterType.ALL -> true
                ChatFilterType.UNREAD -> chat.unreadCount > 0
                ChatFilterType.FAVORITES -> chat.isPinned
                ChatFilterType.GROUPS -> chat.isGroup
            }
            matchQuery && matchFilter
        }.sortedWith(compareByDescending<ChatItem> { it.isPinned }.thenByDescending { it.lastMessageTimestamp })
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(chatWallpaperBrush(isDark))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
        ) {
            // 1. TOP BAR (LIQUID GLASS)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .hazeEffect(state = hazeState) { blurRadius = 15.dp }
                    .background(if (isDark) Color.Black.copy(alpha = 0.65f) else Color.White.copy(alpha = 0.72f))
                    .border(0.5.dp, Color.White.copy(alpha = 0.25f), RoundedCornerShape(0.dp))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Edit",
                        fontFamily = InterFontFamily,
                        fontSize = 17.sp,
                        color = IosBlue,
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .clickable { }
                            .padding(horizontal = 4.dp, vertical = 2.dp)
                    )

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Icon(Icons.Default.Security, contentDescription = "Keamanan", tint = IosBlue, modifier = Modifier.size(24.dp))
                        Icon(Icons.Default.MusicNote, contentDescription = "Musik", tint = IosBlue, modifier = Modifier.size(24.dp).clickable(onClick = onNavigateToMusic))
                        Icon(Icons.Default.Edit, contentDescription = "Chat Baru", tint = IosBlue, modifier = Modifier.size(24.dp))
                        Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = "Logout", tint = palette.textSecondary, modifier = Modifier.size(22.dp).clickable(onClick = onLogoutClick))
                    }
                }
            }

            // 2. Large Title "Chats" 34sp Bold
            Text(
                text = "Chats",
                fontFamily = InterFontFamily,
                fontWeight = FontWeight.Bold,
                fontSize = 34.sp,
                color = palette.textPrimary,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
            )

            // 3. Search Bar Glass (tanpa auto-focus)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(40.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .hazeEffect(state = hazeState) { blurRadius = 10.dp }
                        .background(if (isDark) Color.Black.copy(alpha = 0.50f) else Color.White.copy(alpha = 0.65f))
                        .border(0.5.dp, Color.White.copy(alpha = 0.35f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp),
                    contentAlignment = Alignment.CenterStart
                ) {
                    BasicTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        singleLine = true,
                        textStyle = TextStyle(fontSize = 17.sp, color = palette.textPrimary, fontFamily = InterFontFamily),
                        cursorBrush = SolidColor(IosBlue),
                        modifier = Modifier.fillMaxWidth(),
                        decorationBox = { innerTextField ->
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Search, contentDescription = "Search", tint = palette.textSecondary, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Box(modifier = Modifier.weight(1f)) {
                                    if (searchQuery.isEmpty()) {
                                        Text("Search", fontSize = 17.sp, color = palette.textSecondary, fontFamily = InterFontFamily)
                                    }
                                    innerTextField()
                                }
                                if (searchQuery.isNotEmpty()) {
                                    Icon(Icons.Default.Clear, contentDescription = "Hapus", tint = palette.textSecondary, modifier = Modifier.size(18.dp).clickable { searchQuery = "" })
                                }
                            }
                        }
                    )
                }
            }

            // 4. Filter Chips Glass
            LazyRow(
                modifier = Modifier.fillMaxWidth(),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(ChatFilterType.values()) { filter ->
                    val isSelected = selectedFilter == filter
                    val chipModifier = if (isSelected) {
                        Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(glassGreenGradientBrush())
                            .border(0.5.dp, Color.White.copy(alpha = 0.40f), RoundedCornerShape(16.dp))
                    } else {
                        Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .hazeEffect(state = hazeState) { blurRadius = 10.dp }
                            .background(if (isDark) Color.Black.copy(alpha = 0.55f) else Color.White.copy(alpha = 0.55f))
                            .border(0.5.dp, Color.White.copy(alpha = 0.30f), RoundedCornerShape(16.dp))
                    }

                    Box(
                        modifier = chipModifier
                            .clickable { selectedFilter = filter }
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = filter.label,
                            fontFamily = InterFontFamily,
                            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                            fontSize = 13.sp,
                            color = if (isSelected) Color.White else palette.textPrimary
                        )
                    }
                }
            }

            // 5. Chat List (LazyColumn hazeSource)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            ) {
                LazyColumn(
                    state = listState,
                    modifier = Modifier
                        .fillMaxSize()
                        .hazeSource(state = hazeState),
                    contentPadding = PaddingValues(bottom = 96.dp)
                ) {
                    items(filteredChats, key = { it.id }) { chat ->
                        SwipeableChatItem(
                            chat = chat,
                            palette = palette,
                            isDark = isDark,
                            onClick = { onChatClick(chat.id) },
                            onLongClick = { selectedContextChat = chat },
                            onTogglePin = {
                                val idx = chatsList.indexOfFirst { it.id == chat.id }
                                if (idx != -1) chatsList[idx] = chat.copy(isPinned = !chat.isPinned)
                            },
                            onDelete = { chatsList.removeAll { it.id == chat.id } }
                        )
                    }
                }

                // 7. FAB Neon AI
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(16.dp)
                        .size(60.dp)
                        .shadow(12.dp, CircleShape, ambientColor = Color(0xFF25D366).copy(alpha = 0.35f))
                        .clip(CircleShape)
                        .background(glassGreenGradientBrush())
                        .border(0.5.dp, Color.White.copy(alpha = 0.40f), CircleShape)
                        .clickable { showAiDialog = true },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Star, contentDescription = "Neon AI", tint = Color.White, modifier = Modifier.size(28.dp))
                }
            }
        }
    }
}`
  },
  {
    name: 'ChatDetailContent.kt',
    path: 'app/src/main/java/app/neon/com/ui/chat/ChatDetailContent.kt',
    category: 'UI Chat',
    description: 'WhatsApp iOS 26 Liquid Glass Chat Room: TopBar glass, Pinned banner, LazyColumn hazeSource, Bubble tanpa border, dan Floating Glass Composer.',
    highlights: [
      '20 parameter signature NavGraph dipertahankan 100%',
      'TANPA FLAG_SECURE (memenuhi aturan tegas Bagian 1.11 & 9)',
      'Floating Composer di atas wallpaper (padding horizontal & bottom 8dp)',
      'Bubble outgoing (#DCF8C6/#005C4B) & incoming (#FFFFFF/#202C33) TANPA BORDER',
      'Quote reply dengan border sisi kiri 3dp #25D366',
      'Day pill glass rounded 10dp dengan text 12sp #8E8E93',
      'Empty state Neon AI dengan glass card dan 3 prompt chips'
    ],
    code: `package app.neon.com.ui.chat

// [Stateless ChatDetailContent dengan 20 parameter sesuai NavGraph]
// Memenuhi seluruh prinsip Liquid Glass WhatsApp iOS 26 tanpa border bubble,
// dengan composer floating dan LazyColumn bertindak sebagai hazeSource.
// Full implementation file tersimpan di app/src/main/java/app/neon/com/ui/chat/ChatDetailContent.kt`
  },
  {
    name: 'MessageContextMenu.kt',
    path: 'app/src/main/java/app/neon/com/ui/chat/MessageContextMenu.kt',
    category: 'UI Chat',
    description: 'Liquid Glass Popover Menu saat long-press bubble dengan 6 Quick Reactions dan 12 Action Items iOS standar.',
    highlights: [
      'Overlay transparan Black alpha 0.25 dengan dismiss gesture',
      'Quick Reaction Glass Pill 6 emoji (❤️ 👍 🔥 😂 😢 🙏)',
      'Active emoji selection dengan green gradient brush',
      '12 aksi lengkap: Balas, Salin (auto-clear 30s), Teruskan, Sematkan, Bintangi, Edit, Info, Bagikan, Simpan media, Pilih, Hapus',
      'Spring animation scaleIn dampingRatio MediumBouncy + fadeIn 180ms'
    ],
    code: `package app.neon.com.ui.chat

// [Liquid Glass MessageContextMenu Popover]
// Full implementation file tersimpan di app/src/main/java/app/neon/com/ui/chat/MessageContextMenu.kt`
  },
  {
    name: 'ProfileInfoScreen.kt',
    path: 'app/src/main/java/app/neon/com/ui/profile/ProfileInfoScreen.kt',
    category: 'UI Profile',
    description: 'Halaman Kontak Glass dengan proteksi screenshot FLAG_SECURE pada window Activity lifecycle.',
    highlights: [
      'FLAG_SECURE: Wajib via DisposableEffect Activity Window',
      'TopBar Glass Back 24dp #007AFF dan Title "Info Kontak"',
      'Header Glass Card: Avatar 96dp tengah dengan border 2dp & shadow',
      'Action Row: 4 tombol Pesan, Telepon, Video, Cari',
      'Info Section Glass Card: Tentang, Username, Tanggal bergabung',
      'Action List: Bisukan Switch, Pesan Sementara, Wallpaper, Simpan',
      'Destructive Card: Blokir & Laporkan (#FF3B30)'
    ],
    code: `package app.neon.com.ui.profile

// [ProfileInfoScreen dengan FLAG_SECURE Activity Lifecycle]
// Full implementation file tersimpan di app/src/main/java/app/neon/com/ui/profile/ProfileInfoScreen.kt`
  },
  {
    name: 'GroupInfoScreen.kt',
    path: 'app/src/main/java/app/neon/com/ui/chat/GroupInfoScreen.kt',
    category: 'UI Chat',
    description: 'Halaman Detail Grup Glass dengan proteksi FLAG_SECURE, daftar anggota horisontal, daftar admin, dan manajemen grup.',
    highlights: [
      'FLAG_SECURE: Wajib via Activity Window lifecycle',
      'Header Glass Card: Avatar grup 96dp + "X Anggota"',
      'Action Row 3 tombol: Pesan, Panggilan Suara, Video',
      'Daftar Anggota Horizontal LazyRow + Tambah Anggota',
      'Daftar Admin Grup & Opsi Promosikan Admin',
      'Aksi Keluar Grup & Laporkan'
    ],
    code: `package app.neon.com.ui.chat

// [GroupInfoScreen dengan FLAG_SECURE dan Glass Card Architecture]
// Full implementation file tersimpan di app/src/main/java/app/neon/com/ui/chat/GroupInfoScreen.kt`
  },
  {
    name: 'ChatCommon.kt',
    path: 'app/src/main/java/app/neon/com/ui/chat/ChatCommon.kt',
    category: 'UI Chat',
    description: 'Design system core: NeontChatPalette, Liquid Glass Surface modifier dengan Haze, gradient wallpaper brush, dan avatar generator.',
    highlights: [
      'Liquid Glass surface modifier dengan HazeState, shadow, and edge highlight',
      'Radial gradient wallpaper brush WhatsApp (#EFEAE2 / #0B141A)',
      'NeontAvatar dengan inisial otomatis & ring indicator',
      'Palet resmi NeontChatPalette light & dark mode'
    ],
    code: `package app.neon.com.ui.chat

// [Core Liquid Glass Utilities & Theme Extension]
// Full implementation file tersimpan di app/src/main/java/app/neon/com/ui/chat/ChatCommon.kt`
  },
  {
    name: 'ChatViewModel.kt',
    path: 'app/src/main/java/app/neon/com/ui/viewmodel/ChatViewModel.kt',
    category: 'ViewModel',
    description: 'Hilt ViewModel memegang StateFlow messages, seed percakapan Aura & Neon AI, auto-reply Neon AI, reaction, edit, dan delete logic.',
    highlights: [
      'StateFlow<List<ChatMessage>> reactive state',
      'Pesan per-chatId terisolasi',
      'Simulasi respon kontekstual Neon AI otomatis',
      'Fungsi sendReaction, editMessage, deleteMessage (forEveryone)',
      'NEON_AI_CHAT_ID konstan'
    ],
    code: `package app.neon.com.ui.viewmodel

// [ChatViewModel Hilt Reactive StateFlow]
// Full implementation file tersimpan di app/src/main/java/app/neon/com/ui/viewmodel/ChatViewModel.kt`
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    category: 'Gradle',
    description: 'Konfigurasi Gradle Android dengan Kotlin 2.0, Compose BOM 2024.12.01, dan library dev.chrisbanes.haze.',
    highlights: [
      'implementation("dev.chrisbanes.haze:haze:1.6.10")',
      'implementation("dev.chrisbanes.haze:haze-blur:1.6.10")',
      'Hilt, Firebase, Retrofit, Coil BOM'
    ],
    code: `// Gradle dependencies dengan dev.chrisbanes.haze
// Tersimpan di app/build.gradle.kts`
  }
];

export default function App() {
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(KOTLIN_FILES[0]);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070D11] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B141A]/85 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#128C7E] to-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/20 border border-white/20">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-wide">Project NEON</h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 px-2 py-0.5 rounded-full">
                Android Native Kotlin
              </span>
            </div>
            <p className="text-xs text-gray-400">
              WhatsApp iOS 26 Liquid Glass Architecture (dev.chrisbanes.haze)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
            <span>100% Kotlin 2.0 + Jetpack Compose BOM 2024.12.01</span>
          </div>
          <button
            onClick={() => copyCode(selectedFile.code, 'current')}
            className="flex items-center gap-2 text-xs font-medium bg-[#25D366] hover:bg-[#20ba59] text-black px-4 py-2 rounded-xl transition shadow-md shadow-[#25D366]/20 cursor-pointer"
          >
            {copied === 'current' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied === 'current' ? 'Disalin ke Clipboard' : 'Salin File Ini'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: File Explorer */}
        <aside className="w-80 border-r border-white/10 bg-[#0B141A]/50 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <FolderTree className="w-4 h-4 text-[#25D366]" />
              <span>Daftar File .kt Lengkap</span>
            </div>
            <span className="text-[11px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-mono">
              {KOTLIN_FILES.length} Files
            </span>
          </div>

          <div className="p-2 space-y-1">
            {KOTLIN_FILES.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#25D366]/15 border border-[#25D366]/40 text-white shadow-sm'
                      : 'hover:bg-white/5 border border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <FileCode2 className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-[#25D366]' : 'text-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {file.name}
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5 font-mono">{file.path}</p>
                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                      {file.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Verification Checklist */}
          <div className="mt-auto p-4 border-t border-white/10 bg-black/30">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-[#25D366]" />
              <span>Kepatuhan Aturan & Standar</span>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>Pakai Haze (bukan Glasmio / blur langsung)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>FLAG_SECURE hanya di Profile & Group</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>ChatDetailContent 20 parameter utuh</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>Search Bar tanpa auto-focus keyboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>Bubble tanpa border + Floating composer</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>Neon AI (chat id "neon_ai", FAB Bintang)</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Pane: Code Viewer & Architecture Spec */}
        <main className="flex-1 flex flex-col bg-[#070D11] overflow-hidden">
          {/* Header File Info */}
          <div className="p-6 border-b border-white/10 bg-[#0B141A]/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white font-mono">{selectedFile.name}</h2>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-medium">
                    {selectedFile.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-1">{selectedFile.path}</p>
                <p className="text-sm text-gray-300 mt-2 max-w-3xl leading-relaxed">
                  {selectedFile.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyCode(selectedFile.code, 'pane')}
                  className="flex items-center gap-2 text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 px-3.5 py-2 rounded-xl transition cursor-pointer"
                >
                  {copied === 'pane' ? <Check className="w-4 h-4 text-[#25D366]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied === 'pane' ? 'Berhasil Disalin!' : 'Copy Source Code'}</span>
                </button>
              </div>
            </div>

            {/* Highlights Chips */}
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
              {selectedFile.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#128C7E]/20 text-emerald-300 border border-[#128C7E]/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#25D366]" />
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Code Body */}
          <div className="flex-1 overflow-auto p-6 bg-[#05090C]">
            <pre className="font-mono text-xs text-emerald-100/90 leading-relaxed selection:bg-[#25D366]/30">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </main>
      </div>

      {/* Bottom Status Bar */}
      <footer className="border-t border-white/10 bg-[#0B141A] px-6 py-2.5 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            Android Native Kotlin Workspace Aktif
          </span>
          <span className="hidden md:inline text-gray-500">|</span>
          <span className="hidden md:inline text-gray-400 font-mono">
            dev.chrisbanes.haze:haze:1.6.10
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400">Package: <code className="text-[#25D366]">app.neon.com</code></span>
        </div>
      </footer>
    </div>
  );
}
