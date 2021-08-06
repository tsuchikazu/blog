---
title: "JavaScriptのモジュール管理(CommonJSとかAMDとかBrowserifyとかwebpack)"
date: "2015-02-02"
categories: 
  - "フロントエンド"
tags: 
  - "javascript"
  - "node"
---

昨年の[Advent Calendar](http://tsuchikazu.net/advent-calendar-2014-frontend/)を眺めたり、JS周りの記事を見ていると、RequireJSとか、CommonJSとか、AMD、Browserify、webpackあたりが、同じような文脈で登場するんですが、それぞれ何を指しているのかよくわからなかったため、今更ながらまとめてみます。

## 前提

小規模にしかJavaScriptを使っていないWebサイトでは、jQueryを使ってDomイベントで色んな処理をして、Domに反映させる。というような処理が、ごちゃっとまとめて書くことが多いかと思います。ごちゃっととは、特にDomにしか情報を保持していない状態を指していて、イメージとしてはこのようなコードです。

```
$(function() {
  # イベントハンドラ
  $("#btn").on("click", function(){
    $.ajax({
      url: "api/resources",
      dataType: "json",
    }).done(function(resources){
      # 描画
      $.each(resouces, function(resource) {
        $('<li>')
          .text(resource.name)
          .appendTo("#list")
          .on("click", function(){
            ...
          });
      });
  });
});
```

ちょっとだけ書くならいいかもしれませんが、このようなコードが増え続けると、もうわけがわからなくなります。そのため、規模が大きくなるとMV※に分けて、実装する必要があります。その必要性や、どう分けていけばいいのかは、 [フロントエンドJavaScriptにおける設計とテスト](http://hokaccha.github.io/slides/javascript_design_and_test/) のスライドや、[0行から始めるクライアントサイドJavaScript入門 - Qiita](http://qiita.com/nowri/items/928f2271d50bfa74cb70#100%E8%A1%8C) の記事を読むとだいたいイメージが掴めます。  
また、jQueryやlodashなど外部のモジュールも使いたいでしょう。

外部のモジュールや、自分のモジュールを分割していくと、モジュール間に依存関係が生まれます。それらの依存関係を、ブラウザの実行時やファイル結合時に、うまく解決する方法というのが今回の記事の内容になります。

## これまでどうやっていたか

そもそもなんでこんな話になるかというと、JavaScriptには他のサーバサイド言語にあるようなモジュールの定義や、他のモジュールを読み込む仕組みが、言語仕様として用意されていないのが原因です。そのため通常は、依存関係を考えて、scriptタグを順番に並べたり、順番に結合したりします。[Concatだけでビルドを済ませてた例（Backbone.jsとAngularJS） ::ハブろぐ](http://havelog.ayumusato.com/develop/others/e613-concat_build_pattern_examples.html) を読むと、特有のルールは必要になるとはいえ、それで十分なケースも多くあるようです。

しかし、ES6にはモジュールの仕組みが取り込まれるため、今からモジュールベースの開発に慣れておくのがいいのではないでしょうか。

## CommonJSとAMD

今、モジュール定義と依存解決のAPI仕様(スタイル)として、大きく2つあるようです。それが、CommonJSのModuleとAMDです。

### CommonJSとは

CommonJSとは、JavaScriptでサーバサイドやコマンドラインツール、GUIツールなど色んなアプリを開発するための標準的なAPIの仕様です。(文脈によってはそれを決めるプロジェクト)

遡ること2009年ごろ、JavaScript最高。JavaScriptでサーバサイドも作りたい。という人が現れましたが、JavaScriptはブラウザ上で動かすために生まれた言語のため、  
「モジュール定義や読み込みもない。標準入出力もない。File I/Oもない。標準的に欲しいものが色々ない。」  
という状況の中で、Node.jsのようなサーバサイドでJavaScriptが動く環境が多く生まれてきました。それぞれで、勝手にオレオレAPIを作るのではなく、標準的なAPIの仕様を決めて、それに沿った実装にしよう。そうすれば、色んなサーバサイドJavaScript環境で動くでしょう。と言って始まったのがCommonJSです。  
当初ServerJSというサーバサイドのAPI仕様だけを定めていましたが、それ以外もこれでいいのでは？ということで、CommonJSに改名しました。

とはいえ、CommonJSで色々API仕様が決まったかというと、そうではなかったようです。しかし、[モジュールのAPI仕様](http://www.commonjs.org/specs/modules/1.0/)は、Node.jsで実装されそれが広まったこともあり、広く知られるようになりました。(仕様が決まらず、実装が先行しているのは、最近のExtensible Webにも近い感じがします)

CommonJSのモジュール定義と、読み込み仕様

```
# math.js
module.exports.add = function() {
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
        sum += args[i++];
    }
    return sum;
};

# increment.js
var add = require('math').add;
exports.increment = function(val) {
    return add(val, 1);
};

# main.js
var inc = require('increment').increment;
var a = 1;
inc(a); // 2
```

このCommonJSのモジュール仕様に沿って書いたJavaScriptを、ブラウザ上で動かせるようにしたモジュールシステムが[Browserify](http://browserify.org/)です。  
Browserifyは、実行時にrequireに指定されたモジュールを読み込むというアプローチではなく、事前にrequire部分を書き換えるビルドプロセスというアプローチをとっています。本題の依存関係もそのビルドプロセスで解決してくれます。実際にブラウザが実行するファイルは、Browserifyによってビルドされたものになります。

### AMDとは

AMDとはAsynchronous Module Definitionの略で、モジュールを非同期でロードする仕組みとか、そのための定義とか、API仕様を指します。AMDも元々は、[CommonJSのModules/AsynchronousDefinition](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition)で、仕様を決めていました。しかし、そこでは仕様が決めきれず、[GoogleGroup](https://groups.google.com/forum/#!forum/amd-implement)や[GitHub(amdjs/amdjs-api)](https://github.com/amdjs/amdjs-api)に移動したようです。

AMDのモジュール定義と、読み込み仕様

```
# print.js
define(function () {
    return function print(msg) {
        console.log(msg);
    };
});

# main.js
define(["print"], function (print) {
    print("Hello World");
});
```

AMDのブラウザでの実装が、[RequireJS](http://requirejs.org/)です。Browserifyとは違い、ビルドで依存関係を解決するのではなく、実行時に依存関係を解決します。あるモジュールを実行する際に、必要なモジュールがまだロードされていない場合、非同期でロードするようになっています。

RequireJSは、モジュールシステムの中でも比較的古く、フロントエンドでの先駆け的な存在でした。しかし、設定が複雑であったり、Node.jsと同じように書けたほうがいいということで、フロントエンドでもCommonJSスタイル(+Browserify or webpack)で書くほうが主流になってきているようです。

### webpackとは

ついで的な扱いとなってしまいましたが、[webpack](http://webpack.github.io/)はRequireJSやBrowserifyよりも後発のモジュールシステムです。仕組み的には、Browserifyと同様に、ビルドプロセスで依存関係を解決します。先述のCommonJSとAMDの両方のスタイルを同時にサポートするのが特徴です。複数のファイルに出力できたりと、便利な設定が出来るようです。

## まとめ

Angularのようにモジュール定義と依存解決の仕組みもフレームワークが用意してくれることも多いです。それ以外の場合も、来たるべくES6の世界に向けて、これらの仕組みを使ってJavaScriptのモジュールに慣れておくのがいいんじゃないでしょうか。  
今回紹介した内容について、使い方も含めてもっと詳しい説明が、[WEB+DB PRESS vol.84 の Webフロント最前線 Webフロントエンドのモジュール管理](http://www.amazon.co.jp/WEB-DB-PRESS-Vol-84-%E5%90%BE%E9%83%8E/dp/4774169552%3FSubscriptionId%3DAKIAIUCJKUPMZBTJZATA%26tag%3Dtsuchikazu-22%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D4774169552) に載っていますので、この記事を読むくらいならこの本を買って読みましょう。
