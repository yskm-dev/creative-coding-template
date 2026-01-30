# Creative Coding Template

TypeScript + Vite + ESLint + Prettierを使用したクリエイティブコーディングのテンプレートプロジェクトです。

## 機能

- ⚡️ **Vite** - 高速な開発サーバーとビルドツール
- 🔷 **TypeScript** - 型安全な開発
- 🎨 **ESLint** - コード品質の維持
- ✨ **Prettier** - 自動コードフォーマット

## セットアップ

```bash
# 依存関係のインストール
npm install
```

Node.jsのバージョンは`.node-version`で管理されています。

## 開発コマンド

```bash
# 開発サーバーを起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# ESLintでコードをチェック
npm run lint

# ESLintで自動修正
npm run lint:fix

# Prettierでフォーマット
npm run format
```

## プロジェクト構成

```
creative-coding-template/
├── src/
│   ├── index.html    # HTMLテンプレート
│   ├── main.ts       # エントリーポイント
│   ├── counter.ts    # サンプルコード
│   └── style.css     # スタイル
├── .vscode/          # VSCode設定
├── vite.config.ts    # Vite設定
├── tsconfig.json     # TypeScript設定
├── .eslintrc.cjs     # ESLint設定
├── .prettierrc       # Prettier設定
├── .node-version     # Node.jsバージョン指定
└── package.json      # プロジェクト設定
```

## 開発を始める

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで http://localhost:5173/ を開く
3. `src/main.ts` を編集してコーディングを開始

コードは自動的にリロードされます。
