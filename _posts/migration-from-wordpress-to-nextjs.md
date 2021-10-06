---
title: "blogをWordPressからNext.jsへ移行しました"
date: "2021-10-06"
tags:
  - "javascript"
---

blogを始めた当初から利用していたWordPressですが、元々放置していたということもあり、他の何かへ移行したいと思いながら、はやN年経っていました。WordPressを動かしてきたサーバの契約更新のタイミングがきたので、重い腰を上げて移行しました。移行先には、Next.jsをこれまでちゃんと触ってこなかったので触っておくかーという気持ちから、Next.js + Vercelへ移行しました。

移行でやってきたことを、簡単にまとめます。

## create-next-app --example blog-starter-typescript
Next.jsで0からblogを作ろうとすると、そこそこ大変で燃え尽きそうなので、なるべく楽できる方法を探しました。[Next.jsのexample](https://github.com/vercel/next.js/tree/master/examples)を見てみると、大量のexampleがあるので、[blog-starter-typescript](https://github.com/vercel/next.js/tree/master/examples/blog-starter-typescript)を選んで、スタートしました。
TypeScriptでblogを書くのに最低限の要素は揃ってはいるが、managedなblogサービスと比べると、全然足りんな。という気持ちです。そこを少しずつ育てていく。という楽しみができてそれはそれでよいですが、面倒といえば面倒でした…


## wordpress-export-to-markdown で記事のmarkdown化
WordPressのexport機能で出力したxmlは、記事の部分はHTMLで書かれていて、それをmarkdownへ変換したいです。
[wordpress-export-to-markdown](https://github.com/lonekorean/wordpress-export-to-markdown) を利用すると、画像も含めてほとんど修正する必要がないぐらいキレイにmarkdown化されたので、最高でした。
もともとWordPressでもプラグインを入れて、markdownで書いていたというのもあるかもしれません。
内部的にHTML -> markdownの変換には、[turndown](https://github.com/mixmark-io/turndown)が利用されているようで、これだけでもなにかに使えるかもしれないです。

## markdownで書いた記事のスタイル調整
blog-starter-typescript のままだと、記事のスタイルがほとんど当たってなかったので、
[github-markdown-css](https://github.com/sindresorhus/github-markdown-css)と[highlight.js](https://highlightjs.org/)で、GitHubっぽいスタイルに変更しました。
highlight.jsの導入には、以下の記事が参考になりました。
- [How to use Highlight.js on a Next.js site - DEV Community](https://dev.to/kentico-kontent/how-to-use-highlight-js-on-a-next-js-site-f9)

## og:image の画像ファイルの自動生成
最近、blogのサービスでやられている、タイトル名をそのままog:imageに利用するやつ。何もないより見やすいと思って、[catchy-image](https://github.com/kentaro-m/catchy-image) を利用して、build時に画像を生成するようにしました。

![og:imageサンプル](og-images/vue-reg-suit-visual-regression-testing.png)


あとは、トップページに雑なページングをつけたり、スタイルを調整したりなど、微調整をして今の形になります。もっとコードが気になる方は [tsuchikazu/blog](https://github.com/tsuchikazu/blog) こちらをどうぞ！！
