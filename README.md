
# 目次
- [目次](#目次)
- [概要](#概要)
- [CSVの構造](#csvの構造)
- [CSVサンプル](#csvサンプル)
- [入力・出力](#入力出力)
- [実行環境](#実行環境)
- [コマンド](#コマンド)
- [実行フロー](#実行フロー)
- [実行環境](#実行環境-1)
- [Nodejsについて](#nodejsについて)
- [import文の注意](#import文の注意)

# 概要
- NFTプロジェクト用のメタデータJSONを生成するスクリプトです。
- スプレットシートなどでメタデータの内容を記入したCSVファイルを一括で変換します。

# CSVの構造
- CSVのヘッダーがJSONのプロパティ名になります。
- ヘッダー以下のセルの値が、対応するプロパティのバリューになります。
- メタデータの形式はOpen Sea Metadata Standardを想定しています。
- 変換プログラム実行時にattributesにする開始位置の列を指定します。
- attributesはヘッダーに書かなくて良いですが、変わりにヘッダーをtrait_typeの値になります。
# CSVサンプル
![/document/sample-csv-image.png](/document/sample-csv-image.png)

# 入力・出力
- コマンドライン引数としてCSVファイルのパスを受け入れます。
- 生成されたJSONファイルはCSVファイルと同じディレクトリに、CSVファイル名のディレクトリに保存されます。
- 各CSVの行は、個別のJSONファイルに変換されます。

# 実行環境
- TypeScriptで実装されており、Node.jsで動作します。
- 必要なモジュールをインストールするには、npm installを実行します。


# コマンド
- 実行
  - `npm run start`

# 実行フロー
- `src/*`内のtypescriptをトランスコンパイルされる。
- `dist/*`内にコンパイル済みのjsが生成される。
- nodejsで`./dist/index.js`が実行される。


# 実行環境
- node: v18.12.1
- typescript: 5.1.3


# Nodejsについて
- Node.jsはGoogleのV8 JavaScriptエンジンを採用しています。
- V8はECMAScript 2015（ES6）の[標準](https://nodejs.org/ja/docs/es6)に従ってJavaScriptのコードを解釈します。


# import文の注意
- `import { User } from "./user/user.js";`
- tsファイルでもimport時は.jsとして読み込む。
- トランスパイルした際にjsが拡張子を判断できないため。