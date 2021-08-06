---
title: "第1回ペパボテックカンファレンスでAngularJSの継続的なバージョンアップについて発表しました"
date: "2015-04-25"
categories: 
  - "フロントエンド"
tags: 
  - "angularjs"
coverImage: "22db2312e9c72eb86830ea2ca2c10f4c.png"
---

4月19日(日)に[第1回ペパボテックカンファレンス](http://pepabo.connpass.com/event/13208/)が開催され、「AngularJSの継続的なバージョンアップ」というタイトルで発表しました。なんでこのイベントが開催されたか等は、antipopさんのエントリをどうぞ

- [第1回ペパボテックカンファレンスを開催しました #pbtech - delirious thoughts](http://blog.kentarok.org/entry/2015/04/20/115226)

最近、Angularを触ることが多く、どっかで何か喋りたい気分だったのもあり、いい機会だったため今回発表させていただきました。発表後のAftershow的になんか書いておきます。

<iframe src="//www.slideshare.net/slideshow/embed_code/key/8ZZg7ZIgkUpuhM" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen></iframe>

**[Angular jsの継続的なバージョンアップ](//www.slideshare.net/TsuchiKazu/angular-js-47156399 "Angular jsの継続的なバージョンアップ")** from **[Kazuyoshi Tsuchiya](//www.slideshare.net/TsuchiKazu)**

### テーマの背景

まず、Angularネタで何か喋りたかったのですが、どうせAngular触ってる人あんま来ないんだろうなーというのは、最初から想像がついていたので、(それでも普段触っている人が会場に、4, 5人ぐらいはいたかと。ありがとうございます！) Angularの話ばかりというより、抽象度をあげて話したほうがいいかなー。とはいえ、Angularの話したいんだよなー。と悩んでいました。

Angular採用を決めた時期を思い返すと、去年の秋ぐらい？ちょうどAngularがDisられ始めたけど、Angular2やReactの話はまだ出ていなかった頃だったと思います。開発がスタートした後に、AtScriptが発表されたり、Angular2はどうかしちゃった？エントリとか、Reactブームが到来したりとかで、正直Angular失敗したかなー。とはいえ、あの時期はこれぐらいしか選べなかったしなー。という悶々とした思いを持ち続けていました。

今回のプロジェクトは、治安の悪くなったシステムを、AngularとRailsのAPIで作りなおそうというプロジェクトで、最大の功績はサーバサイドをAPIというキレイで平和なもので、包み隠すことが出来たことです。会社の人でフロントエンドはAPI叩くだけなんだから、すぐ捨てて新しいの作ればいいんだよ。みたいなことを言ってる人がいて、それにだいぶ共感しており、このシステムはAngular1系と共に死ねばいい(フロントエンドは)のだろうなと考えていました。

そんな中、3月に開催されたng-conf & ng-japanで、angularチームの1から2への移行にだいぶ気を使っている様子を見て、これはもしかすると2系に移行できるのでは？という期待から今回のような内容にしました。 本当に移行できるかどうかは、正直わかりません。今、Angularを使っている方々と一緒に、Angularを見捨てずにがんばっていきたいなという気持ちです。とりあえず、New Router(Component Router?)に移行はしてみたので、それはまた別エントリで。

### 内容について

大したことを言っていませんが、「次期バージョンを見据えた実装」のTipsに関しては、こうするのがいいんだろうなとボンヤリとは思っていましたが、ng-confでも同じような発表をしている人がいて([Angular 1 meets Angular 2](http://mzgol.github.io/slides/ng-1-meets-ng-2/#/))、やっぱりそうだよね。という気持ちを強くしました。  
「テスト」に関しても、実際にやっていることではありますが、[AngularJS Japan User Group](https://angularjs-jp.doorkeeper.jp/)で開催されたいくつかのイベントで相談させてもらいました。ありがとうございました。  
もうすぐ[#GDGKobe Angular勉強会#3 on Zusaar](http://www.zusaar.com/event/6007003)も開催されます。特に[@armorik83](https://twitter.com/armorik83)さんのセッションは必見かと。それまで正座待機ですね。

### おわりに

ということで、Angularのことを見捨てずにこれからもよりよい付き合い方をしていきましょう。

\[amazonjs asin="4844336681" locale="JP" title="AngularJSリファレンス"\]
