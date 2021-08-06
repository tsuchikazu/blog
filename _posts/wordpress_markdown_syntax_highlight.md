---
title: "WordPressでMarkdown + Syntaxハイライトするには"
date: "2012-11-07"
categories: 
  - "wordpress"
tags: 
  - "markdown"
  - "markdown-on-save-improved"
  - "wordpress"
coverImage: "medium_7702900836.jpg"
---

みなさんはどのようなエディタでどのような記法で文章を書いていますか？最近、エンジニアの中で一番人気な記法はMarkdownではないでしょうか。GitHubでのwikiやREADMEの形式に採用されて火がつき、最近だとはてなブログもMarkdown記法に対応してくれました。

このブログもMarkdown記法で書いています。さらに当然なことながら、ソースコードなどを掲載した場合には、Syntaxハイライトして欲しいわけです。 その際に使用したプラグインをご紹介します。

### Markdown プラグイン

[Markdown on Save Improved](http://wordpress.org/extend/plugins/markdown-on-save-improved/)を使っています。インストールすると投稿画面の右上に、ウィジェットが表示されます。 [![](images/86e98667b3c7dd0f4cfa999d34b6f76c.jpg "Markdown")](https://tsuchikazu.net/wp-content/uploads/2012/11/86e98667b3c7dd0f4cfa999d34b6f76c.jpg) チェックを外した状態でMarkdown記法で記事を登録すると、HTMLへ変換して投稿されます。簡単、便利。

### Syntaxハイライト プラグイン

* * *

2016/02/21 追記 WordPressをバージョンアップしたタイミングで、以下のプラグインたちが動かなくなってしまったため、現在は[highlight.js](https://highlightjs.org/)を使ってハイライトしています。

以下のようなコードを出力することで、Markdownで書いたソースコードソースがハイライトされます。

```
<!-- テーマは多く用意されているので、好きなテーマのcssを読み込みましょう -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.1.0/styles/zenburn.min.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.1.0/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```

* * *

以下、過去の情報です

[Markdown on Save Improved](http://wordpress.org/extend/plugins/markdown-on-save-improved/)だけでは、Syntaxハイライトされないため、今回はgoogleが提供している [prettify](http://code.google.com/p/google-code-prettify/)を使ってハイライトします。 WordPressのプラグインとして、いくつか配布されているので、3つほど紹介します。

まず、準備段階として`prettify`を適用するには、preタグまたはcodeタグのclassに`prettyprint`を指定しなければなりません。テーマを直接編集して、次のjavascriptを呼び出すようにしています。

```
jQuery(function() {
  jQuery("code").addClass("prettyprint");
});
```

では、次のようなMarkdown記述で、プラグインごとにどう表示されるでしょうか。

    print "hello world" #スペース4つ or タブ

1. [Prettify For WordPress](http://wordpress.org/extend/plugins/prettify-wordpress/)
    
    独自で変なCSSを当ててるようで、大きくデザインが崩れました。 [![](images/c61dc5113c17db829648dbad5581cc78.jpg "Prettify For WordPress")](https://tsuchikazu.net/wp-content/uploads/2012/11/c61dc5113c17db829648dbad5581cc78.jpg)
    
2. [Prettify GC Syntax Highlighter](http://wordpress.org/extend/plugins/prettify-gc-syntax-highlighter/)
    
    変なCSSが当たらず、うまくハイライトされています。 [![](images/4e15f4928bda209c96677acde9c52ec4.jpg "Prettify GC Syntax Highlighter")](https://tsuchikazu.net/wp-content/uploads/2012/11/4e15f4928bda209c96677acde9c52ec4.jpg)
    
3. [WP Code Prettify](http://wordpress.org/extend/plugins/wp-code-prettify/)
    
    これは設定画面で、styleも選べてちょっと高機能です。 [![](images/2b1b8603d9d23f7c83fb8f9151cd882b.jpg "WP Code Prettify")](https://tsuchikazu.net/wp-content/uploads/2012/11/2b1b8603d9d23f7c83fb8f9151cd882b.jpg) 適用した感じはこんな感じ。 [![](images/3902e0f06973b4a4cb2f23965e7a1279.jpg "WP Code Prettify")](https://tsuchikazu.net/wp-content/uploads/2012/11/3902e0f06973b4a4cb2f23965e7a1279.jpg)
    

個人的には[WP Code Prettify](http://wordpress.org/extend/plugins/wp-code-prettify/)が気に入ったので、当分これを使っていきます。 今回探した限りだとgithub-flavored-markdownに対応したプラグインがなかったけど、やっぱり使いたいので気が向いたら作ろうかなー。

エンジニアのスゴイ人の間では、WordPressではなく[octopress](http://octopress.org/)も人気らしいので、そっちも試してみたいところです。
