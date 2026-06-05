/*
 * Copyright 2026 Dheyn Michael Orlanda
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// ─── Supported locale codes ─────────────────────────────────────────────────
export type Locale = "en" | "es" | "fr" | "de" | "ja";

// ─── Translation shape ───────────────────────────────────────────────────────
export interface Translations {
  // Sidebar
  sidebar: {
    history: string;
    lastSevenDays: string;
    newChat: string;
    searchChat: string;
    recent: string;
    settings: string;
    help: string;
  };
  // Header
  header: {
    model: string;
    selectModel: string;
  };
  // Welcome screen
  welcome: {
    greeting: string;
  };
  // Chat input
  chat: {
    placeholder: string;
  };
  // Settings panel
  settings: {
    title: string;
    subtitle: string;
    // General section
    general: string;
    defaultModel: string;
    defaultModelDesc: string;
    outputLanguage: string;
    outputLanguageDesc: string;
    // Appearance section
    appearance: string;
    interfaceTheme: string;
    interfaceThemeDesc: string;
    light: string;
    dark: string;
    system: string;
    compactMode: string;
    compactModeDesc: string;
    // Security section
    security: string;
    apiKeyConfig: string;
    apiKeyDesc: string;
    update: string;
    keyActive: string;
    // Footer
    saveChanges: string;
    cancel: string;
  };
  // Help panel
  help: {
    title: string;
    subtitle: string;
    // Documentation
    documentation: string;
    gettingStarted: string;
    gettingStartedDesc: string;
    apiReference: string;
    apiReferenceDesc: string;
    bestPractices: string;
    bestPracticesDesc: string;
    // Keyboard shortcuts
    keyboardShortcuts: string;
    shortcutNewChat: string;
    shortcutSearchChats: string;
    shortcutFocusInput: string;
    shortcutToggleSidebar: string;
    shortcutSettings: string;
    shortcutClearConversation: string;
    // Support
    support: string;
    reportIssue: string;
    joinCommunity: string;
    close: string;
  };
}

// ─── Translations map ────────────────────────────────────────────────────────
const translations: Record<Locale, Translations> = {

  // ── English ────────────────────────────────────────────────────────────────
  en: {
    sidebar: {
      history: "History",
      lastSevenDays: "Last 7 days",
      newChat: "New Chat",
      searchChat: "Search Chat",
      recent: "Recent",
      settings: "Settings",
      help: "Help",
    },
    header: {
      model: "Model",
      selectModel: "Select Model",
    },
    welcome: {
      greeting: "How can I help you today?",
    },
    chat: {
      placeholder: "Message Necookie AI...",
    },
    settings: {
      title: "Preferences",
      subtitle: "Manage model configuration, interface appearance, and security credentials.",
      general: "General",
      defaultModel: "Default Model",
      defaultModelDesc: "Select the primary model for new conversations.",
      outputLanguage: "Output Language",
      outputLanguageDesc: "Preferred language for AI responses.",
      appearance: "Appearance",
      interfaceTheme: "Interface Theme",
      interfaceThemeDesc: "Customize the visual appearance of the app.",
      light: "Light",
      dark: "Dark",
      system: "System",
      compactMode: "Compact Mode",
      compactModeDesc: "Reduce spacing in chat interface for higher information density.",
      security: "Security",
      apiKeyConfig: "API Key Configuration",
      apiKeyDesc: "Provide your custom API key to unlock extended rate limits and enterprise features.",
      update: "Update",
      keyActive: "Key is active and validated",
      saveChanges: "Save Changes",
      cancel: "Cancel",
    },
    help: {
      title: "Help & Documentation",
      subtitle: "Everything you need to set up, use, and master Necookie AI.",
      documentation: "Documentation",
      gettingStarted: "Getting Started",
      gettingStartedDesc: "Basic setup, authentication, and your first request.",
      apiReference: "API Reference",
      apiReferenceDesc: "Detailed endpoints, parameters, and response structures.",
      bestPractices: "Best Practices",
      bestPracticesDesc: "Optimize prompts, handle errors, and manage rate limits.",
      keyboardShortcuts: "Keyboard Shortcuts",
      shortcutNewChat: "New Chat",
      shortcutSearchChats: "Search Chats",
      shortcutFocusInput: "Focus Input",
      shortcutToggleSidebar: "Toggle Sidebar",
      shortcutSettings: "Settings",
      shortcutClearConversation: "Clear Conversation",
      support: "Support",
      reportIssue: "Report an Issue",
      joinCommunity: "Join Community",
      close: "Close",
    },
  },

  // ── Spanish ────────────────────────────────────────────────────────────────
  es: {
    sidebar: {
      history: "Historial",
      lastSevenDays: "Últimos 7 días",
      newChat: "Nuevo chat",
      searchChat: "Buscar chat",
      recent: "Reciente",
      settings: "Configuración",
      help: "Ayuda",
    },
    header: {
      model: "Modelo",
      selectModel: "Seleccionar modelo",
    },
    welcome: {
      greeting: "¿En qué puedo ayudarte hoy?",
    },
    chat: {
      placeholder: "Escribe un mensaje a Necookie AI...",
    },
    settings: {
      title: "Preferencias",
      subtitle: "Gestiona la configuración del modelo, la apariencia y las credenciales de seguridad.",
      general: "General",
      defaultModel: "Modelo predeterminado",
      defaultModelDesc: "Selecciona el modelo principal para nuevas conversaciones.",
      outputLanguage: "Idioma de respuesta",
      outputLanguageDesc: "Idioma preferido para las respuestas de la IA.",
      appearance: "Apariencia",
      interfaceTheme: "Tema de interfaz",
      interfaceThemeDesc: "Personaliza la apariencia visual de la aplicación.",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema",
      compactMode: "Modo compacto",
      compactModeDesc: "Reduce el espaciado en la interfaz de chat para mayor densidad de información.",
      security: "Seguridad",
      apiKeyConfig: "Configuración de clave API",
      apiKeyDesc: "Proporciona tu clave API personalizada para desbloquear límites de velocidad extendidos y funciones empresariales.",
      update: "Actualizar",
      keyActive: "La clave está activa y validada",
      saveChanges: "Guardar cambios",
      cancel: "Cancelar",
    },
    help: {
      title: "Ayuda y documentación",
      subtitle: "Todo lo que necesitas para configurar, usar y dominar Necookie AI.",
      documentation: "Documentación",
      gettingStarted: "Primeros pasos",
      gettingStartedDesc: "Configuración básica, autenticación y tu primera solicitud.",
      apiReference: "Referencia de API",
      apiReferenceDesc: "Endpoints detallados, parámetros y estructuras de respuesta.",
      bestPractices: "Mejores prácticas",
      bestPracticesDesc: "Optimiza prompts, gestiona errores y controla los límites de velocidad.",
      keyboardShortcuts: "Atajos de teclado",
      shortcutNewChat: "Nuevo chat",
      shortcutSearchChats: "Buscar chats",
      shortcutFocusInput: "Enfocar entrada",
      shortcutToggleSidebar: "Alternar barra lateral",
      shortcutSettings: "Configuración",
      shortcutClearConversation: "Limpiar conversación",
      support: "Soporte",
      reportIssue: "Reportar un problema",
      joinCommunity: "Unirse a la comunidad",
      close: "Cerrar",
    },
  },

  // ── French ─────────────────────────────────────────────────────────────────
  fr: {
    sidebar: {
      history: "Historique",
      lastSevenDays: "7 derniers jours",
      newChat: "Nouvelle discussion",
      searchChat: "Rechercher",
      recent: "Récent",
      settings: "Paramètres",
      help: "Aide",
    },
    header: {
      model: "Modèle",
      selectModel: "Sélectionner un modèle",
    },
    welcome: {
      greeting: "Comment puis-je vous aider aujourd'hui ?",
    },
    chat: {
      placeholder: "Écrivez un message à Necookie AI...",
    },
    settings: {
      title: "Préférences",
      subtitle: "Gérez la configuration du modèle, l'apparence de l'interface et les identifiants de sécurité.",
      general: "Général",
      defaultModel: "Modèle par défaut",
      defaultModelDesc: "Sélectionnez le modèle principal pour les nouvelles conversations.",
      outputLanguage: "Langue de sortie",
      outputLanguageDesc: "Langue préférée pour les réponses de l'IA.",
      appearance: "Apparence",
      interfaceTheme: "Thème de l'interface",
      interfaceThemeDesc: "Personnalisez l'apparence visuelle de l'application.",
      light: "Clair",
      dark: "Sombre",
      system: "Système",
      compactMode: "Mode compact",
      compactModeDesc: "Réduisez l'espacement dans l'interface de chat pour une densité d'information plus élevée.",
      security: "Sécurité",
      apiKeyConfig: "Configuration de la clé API",
      apiKeyDesc: "Fournissez votre clé API personnalisée pour débloquer des limites de débit étendues et des fonctionnalités entreprise.",
      update: "Mettre à jour",
      keyActive: "La clé est active et validée",
      saveChanges: "Enregistrer les modifications",
      cancel: "Annuler",
    },
    help: {
      title: "Aide et documentation",
      subtitle: "Tout ce dont vous avez besoin pour configurer, utiliser et maîtriser Necookie AI.",
      documentation: "Documentation",
      gettingStarted: "Premiers pas",
      gettingStartedDesc: "Configuration de base, authentification et votre première requête.",
      apiReference: "Référence API",
      apiReferenceDesc: "Endpoints détaillés, paramètres et structures de réponse.",
      bestPractices: "Meilleures pratiques",
      bestPracticesDesc: "Optimisez les prompts, gérez les erreurs et les limites de débit.",
      keyboardShortcuts: "Raccourcis clavier",
      shortcutNewChat: "Nouvelle discussion",
      shortcutSearchChats: "Rechercher des discussions",
      shortcutFocusInput: "Focaliser la saisie",
      shortcutToggleSidebar: "Afficher/masquer la barre latérale",
      shortcutSettings: "Paramètres",
      shortcutClearConversation: "Effacer la conversation",
      support: "Support",
      reportIssue: "Signaler un problème",
      joinCommunity: "Rejoindre la communauté",
      close: "Fermer",
    },
  },

  // ── German ─────────────────────────────────────────────────────────────────
  de: {
    sidebar: {
      history: "Verlauf",
      lastSevenDays: "Letzte 7 Tage",
      newChat: "Neuer Chat",
      searchChat: "Chat suchen",
      recent: "Aktuell",
      settings: "Einstellungen",
      help: "Hilfe",
    },
    header: {
      model: "Modell",
      selectModel: "Modell auswählen",
    },
    welcome: {
      greeting: "Wie kann ich Ihnen heute helfen?",
    },
    chat: {
      placeholder: "Nachricht an Necookie AI...",
    },
    settings: {
      title: "Einstellungen",
      subtitle: "Verwalten Sie die Modellkonfiguration, die Benutzeroberfläche und die Sicherheitsdaten.",
      general: "Allgemein",
      defaultModel: "Standardmodell",
      defaultModelDesc: "Wählen Sie das primäre Modell für neue Gespräche aus.",
      outputLanguage: "Ausgabesprache",
      outputLanguageDesc: "Bevorzugte Sprache für KI-Antworten.",
      appearance: "Erscheinungsbild",
      interfaceTheme: "Interface-Theme",
      interfaceThemeDesc: "Passen Sie das visuelle Erscheinungsbild der App an.",
      light: "Hell",
      dark: "Dunkel",
      system: "System",
      compactMode: "Kompaktmodus",
      compactModeDesc: "Reduzieren Sie den Abstand in der Chat-Oberfläche für eine höhere Informationsdichte.",
      security: "Sicherheit",
      apiKeyConfig: "API-Schlüssel-Konfiguration",
      apiKeyDesc: "Geben Sie Ihren API-Schlüssel ein, um erweiterte Ratenlimits und Unternehmensfunktionen freizuschalten.",
      update: "Aktualisieren",
      keyActive: "Schlüssel ist aktiv und validiert",
      saveChanges: "Änderungen speichern",
      cancel: "Abbrechen",
    },
    help: {
      title: "Hilfe & Dokumentation",
      subtitle: "Alles, was Sie brauchen, um Necookie AI einzurichten, zu verwenden und zu meistern.",
      documentation: "Dokumentation",
      gettingStarted: "Erste Schritte",
      gettingStartedDesc: "Grundlegende Einrichtung, Authentifizierung und Ihre erste Anfrage.",
      apiReference: "API-Referenz",
      apiReferenceDesc: "Detaillierte Endpunkte, Parameter und Antwortstrukturen.",
      bestPractices: "Best Practices",
      bestPracticesDesc: "Prompts optimieren, Fehler behandeln und Ratenlimits verwalten.",
      keyboardShortcuts: "Tastaturkürzel",
      shortcutNewChat: "Neuer Chat",
      shortcutSearchChats: "Chats suchen",
      shortcutFocusInput: "Eingabe fokussieren",
      shortcutToggleSidebar: "Seitenleiste ein-/ausblenden",
      shortcutSettings: "Einstellungen",
      shortcutClearConversation: "Gespräch löschen",
      support: "Support",
      reportIssue: "Problem melden",
      joinCommunity: "Community beitreten",
      close: "Schließen",
    },
  },

  // ── Japanese ───────────────────────────────────────────────────────────────
  ja: {
    sidebar: {
      history: "履歴",
      lastSevenDays: "過去7日間",
      newChat: "新しいチャット",
      searchChat: "チャットを検索",
      recent: "最近",
      settings: "設定",
      help: "ヘルプ",
    },
    header: {
      model: "モデル",
      selectModel: "モデルを選択",
    },
    welcome: {
      greeting: "今日はどのようにお手伝いできますか？",
    },
    chat: {
      placeholder: "Necookie AI へメッセージを送信...",
    },
    settings: {
      title: "設定",
      subtitle: "モデル設定、インターフェースの外観、セキュリティ認証情報を管理します。",
      general: "一般",
      defaultModel: "デフォルトモデル",
      defaultModelDesc: "新しい会話のメインモデルを選択してください。",
      outputLanguage: "出力言語",
      outputLanguageDesc: "AI 回答の優先言語。",
      appearance: "外観",
      interfaceTheme: "インターフェーステーマ",
      interfaceThemeDesc: "アプリの外観をカスタマイズします。",
      light: "ライト",
      dark: "ダーク",
      system: "システム",
      compactMode: "コンパクトモード",
      compactModeDesc: "チャットインターフェースの余白を減らして情報密度を高めます。",
      security: "セキュリティ",
      apiKeyConfig: "APIキー設定",
      apiKeyDesc: "カスタム API キーを入力して、レート制限の拡張やエンタープライズ機能を有効にしてください。",
      update: "更新",
      keyActive: "キーは有効で検証済みです",
      saveChanges: "変更を保存",
      cancel: "キャンセル",
    },
    help: {
      title: "ヘルプとドキュメント",
      subtitle: "Necookie AI のセットアップ、使用、マスターに必要なすべて。",
      documentation: "ドキュメント",
      gettingStarted: "はじめに",
      gettingStartedDesc: "基本的なセットアップ、認証、最初のリクエスト。",
      apiReference: "API リファレンス",
      apiReferenceDesc: "詳細なエンドポイント、パラメーター、レスポンス構造。",
      bestPractices: "ベストプラクティス",
      bestPracticesDesc: "プロンプトの最適化、エラー処理、レート制限の管理。",
      keyboardShortcuts: "キーボードショートカット",
      shortcutNewChat: "新しいチャット",
      shortcutSearchChats: "チャットを検索",
      shortcutFocusInput: "入力にフォーカス",
      shortcutToggleSidebar: "サイドバーを切り替え",
      shortcutSettings: "設定",
      shortcutClearConversation: "会話をクリア",
      support: "サポート",
      reportIssue: "問題を報告",
      joinCommunity: "コミュニティに参加",
      close: "閉じる",
    },
  },
};

// ─── Hook helper ─────────────────────────────────────────────────────────────
export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.en;
}

export default translations;
