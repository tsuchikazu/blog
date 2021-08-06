---
title: "Vimを使ってMarkdown形式でWordPressに投稿してみる"
date: "2012-11-11"
categories: 
  - "wordpress"
tags: 
  - "markdown"
  - "vim"
  - "vimrepress"
  - "wordpress"
coverImage: "large_2208830522.jpg"
---

先日、[WordPressでMarkdown + Syntaxハイライトするには](https://tsuchikazu.net/wordpress_markdown_syntax_highlight/)という記事で、  
WordPressにMarkdownプラグインをインストールしてMarkdownで投稿できるようにしましたが、  
やはり自分の気に入ったエディタで記事を編集したいものです。

自分は普段のエディタはVimを使っているので、Vimを使用してMarkdown形式でWordPressに投稿してみます。

[VimRepress](https://github.com/vim-scripts/VimRepress)とは、VimのプラグインでWordPressの記事一覧を見れたり、投稿できるものです。  
さらにはMarkdown形式にも対応しているという優れものです。

#### VimへVimRepressをインストールしてみる

自分はVimのプラグインマネージャに[vundle](https://github.com/gmarik/vundle)を使っているので、`~/.vimrc`に

```
" wordpress 投稿
Bundle "vim-scripts/VimRepress"
```

を追加して、

```
:BundleInstall
```

を実行するだけです。

次にWordPressの設定ファイルを準備します。`~/.vimpressrc`に、次のフォーマットで保存します。

```
[Blog0]  
blog_url = https://tsuchikazu.net/  
username = xxxxx  
password = xxxxx
```

#### VimRepressを使ってみる

1. 記事の一覧を見る
    
    ```
    :BlogList
    ```
    
    Enterで記事の編集画面に変わります
    
2. 記事を新規追加する
    
    ```
    :BlogNew
    ```
    
    これで新規記事の編集画面に変わります。EditFormatにHTMLを指定するとHTMLを投稿できます。(Markdown形式はもう少し先で)
    
    投稿するときは
    
    ```
     :BlogSave
    ```
    
    draftオプションを付けると、下書きで投稿します。（draftオプションなし or publishオプションで公開されます）
    
    ```
     :BlogSave draft
    ```
    
    プレビューするときは
    
    ```
     :BlogPreview
    ```
    
    ブラウザが立ち上がり、ローカルでプレビューされます。publishオプションを付けると、記事が公開されプレビューが表示されるので注意が必要です。
    

#### Markdown形式も使えるようにする

記事の編集画面のEditFormatにMarkdownを指定すると、Markdown形式で投稿できます。Markdownが指定された場合に、ローカルでMarkdownからHTMLに変換されて投稿される動きになります。  
その変換にはpython-markdownが使われているため、python-markdownをインストールしましょう。

自分の環境ではeasy\_installが使えたので、コマンド一発でインストール完了です

```
$ sudo easy_install python-markdown2
```

これでEditFormatにMarkdownを指定して、`:BlogSave`すればMarkdown形式で投稿できます。 [![](images/89dee2b2c90be1b4df49c0c0cf69e1fc.jpg "markdown wordpress投稿")](https://tsuchikazu.net/wp-content/uploads/2012/11/89dee2b2c90be1b4df49c0c0cf69e1fc.jpg)

#### VimでMarkdownをハイライトさせる

VimでMarkdown形式をハイライト出来るVimプラグイン[vim-markdown](https://github.com/tpope/vim-markdown)も入れてみました。(ただ、大してハイライトされないので入れなくていいかもですが）  
`~/.vimrc`に

```
" markdown ハイライト
Bundle 'tpope/vim-markdown'
```

を追加して、

```
:BundleInstall
```

を実行。

これで、.md拡張子で保存するか

```
:set filetype = markdown
```

でハイライトされるようになります [![](images/53a5f7ae45bdf5e66e684d6be47b4804.jpg "vim-markdown")](https://tsuchikazu.net/wp-content/uploads/2012/11/53a5f7ae45bdf5e66e684d6be47b4804.jpg) これが現時点で、Vim + Markdown + WordPressの最適解だと思うんですが、個人的にはまだまだ使いづらいですね。
