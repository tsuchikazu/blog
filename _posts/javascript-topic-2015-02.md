---
title: "2015年2月のJavaScriptトピック"
date: "2015-03-02"
categories: 
  - "フロントエンド"
tags: 
  - "angularjs"
  - "javascript"
  - "react"
---

この前1月が終わったと思ったら、もう2月が終わってしまいました。今年の進むスピードは、近年でもNo.1な感じがしています。

さて、私の独断と偏見による2月のJavaScriptトピックを紹介します。

## [React Canvas](https://github.com/flipboard/react-canvas)

FlipboadがReact Canvasを発表しました。Canvasに描画することによって、60fpsでいい感じにアニメーションするスクロールを実現したそうです。

一覧表示はもちろんすごいのですが、個人的には画面遷移であるとか、メニューボタンやメール送信ボタンなどを押した時の動きが、まるでネイティブアプリのようになっていることに、ものすごい衝撃を受けました。  
ReactやAngularや、その他もろもろJS界は動きが激しくなっていますが、それらが目指すものの一つが、このようなネイティブアプリのようなUIのなのかなーと思っています。railsなどが得意としている古き良き紙芝居的なWebアプリではなく、ネイティブアプリのようなWebアプリが今後の主流になっていくのではないでしょうか。

- [Flipboard](https://flipboard.com/) (スマホで見てください)
- [60fps on the mobile web — Flipboard Engineering](http://engineering.flipboard.com/2015/02/mobile-web/)
- [Rebuild: 81: Enable The Broken Web (Hajime Morrita)](http://rebuild.fm/81/)

## [歌舞伎座.tech#6「VirtualDOMとReact」](http://kbkz.connpass.com/event/11254/)

ドワンゴさんが主催している勉強会に参加させていただきました。  
全体として感じたことは、Reactは今後使える技術ではなく、今使える技術になっているということ。また、browserifyなどでnpmモジュールが使いやすくなったことや、ReactのVirtualDomやserverside renderingがあることからも、Isomorphicが普通の世の中になっているようです。 Fluxについては思想としてはシンプルでいいけど、実際にどの実装を使っていけばいいのかは、なかなか難しそう(とりあえず、facebook/fluxなのかなぁ)

- [歌舞伎座.tech#6「VirtualDOMとReact」 アウトラインメモ | Web Scratch](http://efcl.info/2015/02/16/kbkz_tech/)

## Angular 2

[3/5〜3/6のng-conf 2015](http://www.ng-conf.org/)でも話されるようですが、Angular 2のfirst draft versionでのTodo Appが公開されました。まだまだ変わる可能性はあるけど、なんとなく雰囲気は掴めます。Component周りはだいぶシンプルになってわかりやすそうな印象を受けました。Templateまわりは、これはどうなんでしょうか…  
[ng-japan - The first AngularJS conference in Tokyo, Japan (2015/3/21)](http://ngjapan.org/)も参加申し込みも開始されたので、色んな情報を得られそうです。

- [An Angular2 Todo App: First look at App Development in Angular2 - YouTube](https://www.youtube.com/watch?v=uD6Okha_Yj0)
- [Intro to Angular2 - Slide](https://angular2-intro.firebaseapp.com/#/)
- [davideast/ng2do - github](https://github.com/davideast/ng2do)
- [Change Detection in Angular 2 | Victor Savkin](http://victorsavkin.com/post/110170125256/change-detection-in-angular-2)

## おわりに

普段、気になった記事はとりあえずはてブしていますが、それを見返す機会というのはなかなか持てていませんでした。はてブするだけで、満足することもしばしばあります。  
月に1度、自分のはてブや、気になる分野の情報を振り返るというのは、結構いい感じです。

\[amazonjs asin="477414813X" locale="JP" title="パーフェクトJavaScript (PERFECT SERIES 4)"\]
