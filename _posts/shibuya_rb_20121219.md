---
title: "Shibuya.rb 20121219に初めて行ってきた"
date: "2012-12-26"
categories: 
  - "ruby"
tags: 
  - "ruby-shibuya-rb"
  - "行ってみた"
coverImage: "medium_4523756300.jpg"
---

ブログに書くのが遅れましたが、先日[Shibuya.rb 20121219](http://www.zusaar.com/event/447306)に参加してきました。twitterの様子はこちら[#shibuyarb 渋谷.rb\[:20121219\] - Togetter](http://togetter.com/li/425625)  
最近、業務ではPHPばかりですが、社内のRuby系の勉強会に出席したり、プライベートではrailsで開発しているのでコミュニティとか行ってみたいなー。とは思っていたんです。  
同じ会社のスペシャルRubyistである[刺身さん](https://twitter.com/kyanny)にちょうどShibuya.rbを紹介されたのもあって、試しに行ってみました。

- 行ってみたいけど、そこまで勇気が出ない。
- rubyやりたいんだけど業務でやってないし、自信なくてそんなの行けない。
- っていうか、ホント自分チキンなので無理です。

っていう人向けにまとめエントリを書きます。  
自分自身がそうだったので、誰かの参考になれば。

### Shibuya.rbってなにそれ？コワイ

> Shibuya.rbは、渋谷近郊のRubyが好きだったり、  
> Rubyの周辺技術が気になっている人のための地域Rubyistコミュニティです

地域コミュニティっていうのは、近くのRubyistで集まって情報共有とか何かしようよ。  
っていうので、どこのコミュニティかによって色が違うそうです。

詳しい人に聞くところによると、Asakusa.rbはすごい人しかいないコワイところで、Tokyu.rbはとりあえず酒を飲んで酔っ払うところ。らしいです。探してみると他にもいっぱいあるんですね。（[RegionalRubyistMeetUp](https://github.com/ruby-no-kai/official/wiki/RegionalRubyistMeetUp)）

今回行ったShibuya.rbは、コミュニティの中でもかなりゆるーいところで、業務でバリバリ使ってるぜ。Ruby界に貢献するぜみたいな人ばかりではなく、rubyやりたいなーとか、触り始めましたっていうレベルの人もいて、初心者でも全然行きやすいところです。

### 当日のShibuya.rbの様子

#### 始まるまで

今回の会場は、[VOYAGE GROUP BAR AJITO](http://voyagegroup.com/business/office/office015/)で開催されました。  
開始の時間になるまで、洒落乙なBarでみんな好きな席に座って、もくもくとwifiの設定やらなんやらやってました。  
意外とみんな一言も喋らずPCに向かっている感じで、変なところに来てしまったかも。と若干ビビリ気味。

#### 自己紹介

主催者の[@tyabe](https://twitter.com/tyabe)さんの挨拶から、全員の自己紹介が始まりました。  
ここで一気に和やかな空気に変わり、怖い人ばかりじゃなかったので安心しました。  
この日はSIerの人だったり、Web系でバリバリの人だったり、学生の人だったり、ホントいろんな人が集まっていました。  
歳もバラバラ。メインは30代前半あたりかなぁ。というイメージです。

#### LT

Shibuya.rbのスタイルは話したい人が勝手に立候補する。  
順番も時間制限もなにもなし。終わった後にさぁ次は誰やります？  
早い者勝ち。やったもんがち。時間が来たらおしまい。という噂通りのゆるさでした。

会場が[VOYAGE GROUP BAR AJITO](http://voyagegroup.com/business/office/office015/)だったのもあり、  
ビール放題！！飲みながら面白いLTを聞くっていう最高の場所でした。  
印象に残ったお話を抜粋します。

##### 刺身さん

- [rubyconf.tw](http://rubyconf.tw/2012/)の話。
- 台湾めっちゃ良かった。飯うまいし、日本語喋る人いるし、いい人多い。
- 並行の処理の話が多い。デンバーでも多くてみんなアクセス捌くために頑張ってるっぽい。
- あっちのLTはドラが鳴ろうが関係ない。終わらない。気が済むまで話し続ける

##### [@fukayatsu](https://twitter.com/fukayatsu)さん

- 東京Ruby会議でShibuya.rbの紹介LT。その練習。
- コミュニティなんでコミュニティしてください。
- [cakes](https://cakes.mu/posts)というサイトを仕事で作ってる。週150円で便利情報を配信。
- [cakes](https://cakes.mu/posts)の記事は、もしドラの編集者が社長なので、社長に書いてもらったり。フリーのライターさんに、書いてもらったり。
- Cake PHPで出来てるけど、railsで書き直す。アツい。

##### [@shitsyndrome](https://twitter.com/shitsyndrome)さん

- 研究でWebサーバ[bossan](https://github.com/kubo39/bossan)を作った話
- Rack対応しているのでRackアプリ動くよ
- Cで作った
- Thinの2倍!!!のパフォーマンスを叩きだした

##### [@sanemat](https://twitter.com/sanemat)さん

- ruby 2.0の歩き方的な話
- ひとりadvend calendarでプルリク24個送る
- ruby2.0で動かすと、gemがイイカンジに落ちて、イイカンジに地雷を踏めて、イイカンジに探索できて、結果イイカンジに勉強になる
- ちゃんとテストが書かれているライブラリだと、直しやすい。
- 最初は自分でハマったネタを貯めていたんだけど、ネタが無くなってしまい、今は手頃なバグを見つけている

##### [@iR3](https://twitter.com/iR3)さん

- turnip（チューニップ）について
- RSpecのなかでCucumberを使えるので、 2重生活しなくていいですよ。
- capybaraの作者が作ってるので、結構イイカンジ

#### ダラダラ&懇親会

今回はちょうどLTが終わった時間で終了時間だったので、そのままダラダラと周りの人と話ながら、  
2次会行く人は行って、帰りたい人は帰るという感じでした。  
自分は2次会行かなかったので、次回は参加したいですねー。

### まとめ

ということで、初めてShibuya.rb行った感想としては、行かない理由はないです。  
Shibuya.rbはホントゆるい感じなので、Rubyなにそれ？状態で行ってもいいぐらいだし、それでいて、バリバリやっている人もいるので、色々聞きたい人とかコアな話をしたい人でも満足できる、かなり器がでかいコミュニティです。  
そんなだからこそ、色々な人がいて色々な話が聞けて、すごく刺激になります。

ついでに言い過ぎるなら、コミュニティだからコミュニケーションしないといけない。とか、別に考えなくてもいいんじゃないかと。  
それが障壁になって行かないぐらいなら、コミュニケーションなんて取らずに、最初は話を聞くだけでもいいから一回行ってみればいい。  
（自分も今回は他の人とほとんど話すことなく終わりました。主催者の方々すいません。。）  
こういうの行ったことない人にとって、一番怖いのは最初の一歩を踏み出すこと。  
とりあえずはそういう場に行ってみればいい。行ってみればいい意味でこんなもんか。って思えるし、こんな感じなら俺もLTしてみようかな。他のにも出てみようかな。とか、色々と広がっていくんじゃないすかね。  
最初の一歩目としてShibuya.rbほど行きやすい場所はないんじゃないかな。

ということで来月もおそらく第3水曜日。次も行ってみよー