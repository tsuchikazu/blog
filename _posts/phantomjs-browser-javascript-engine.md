---
title: "PhantomJSと各ブラウザのJavascriptエンジンまとめ"
date: "2015-01-20"
categories: 
  - "フロントエンド"
tags: 
  - "javascript"
  - "node"
---

JavaScriptの単体テストやE2Eテスト。書いてますかー？  
それらのテストをCIで実行するとき、Headless ブラウザとして[PhantomJS](https://github.com/ariya/phantomjs)を使っている人が多いと思います。私もそのうちの一人で、仕事でも使っています。

PhantomJSとは、Scriptable Headless WebKitと説明されており、WebKitベースのブラウザです。  
WebKitはただのレンダリングエンジン。という認識だったため、PhantomJSのJavaScriptエンジンはなんだろう？なんでJavaScriptが動いているんだろう？という疑問が沸き起こり、色々調べてみたのでまとめてみます。

## JavaScriptエンジンとは？

JavaScriptエンジンの役割は、JavaScirptを解釈して実行することです。  
例えば、ECMAScript6の機能が使えるブラウザがある。ということは、そのブラウザの「JavaScriptエンジンが」ECMAScript6の構文を解釈できて、実行できているということです。  
一番有名なのはChromeに搭載されているV8で、Node.js(io.js)にも使われていています。

## [PhantomJS](https://github.com/ariya/phantomjs)のJavaScriptエンジンはなに？

結論からいうと、PhantomJSのJavaScriptエンジンは[JavaScriptCore](https://trac.webkit.org/wiki/JavaScriptCore)です。  
SafariのJavaScriptエンジンと同じようです。  
JavaScriptCoreは、SquirrelFishやSquirrelFish Extremeと呼ばれることがありますが、これらはバージョニングのコードネームみたいなもので、全てJavaScriptCoreのことです。  
さらにSafariの文脈ではNitroと呼ばれています。

JavaScriptCoreとは、WebKitにbuilt-inされているJavaScriptエンジンです。  
WebKitは正確にはただのレンダリングエンジンでなく、ブラウザの雛形みたいなもので、WebKitベースのブラウザ達(Safari, 昔のChrome)は多くのコンポーネントが交換出来るようになっていたのです。  
例えば、JavaScriptエンジンも交換可能なコンポーネントの一つで、SafariはデフォルトのJavaScriptCoreを使い、昔のChromeはV8に交換していました。  
WebKitについては、[開発者のための WebKit (“WebKit for Developers” 日本語訳)](http://myakura.github.io/n/webkit4devs.html)を読むとどういうものかわかってくるので、一度読んでみるといいかもしれません。  
(ChromeがWebKitではなく、それをForkした[Blink](http://www.chromium.org/blink)へ移行したため、JavaScriptエンジンの交換はできなくなったかもしれないです)

要は、PhantomJSはWebKitベースのブラウザで、Safariと同じJavaScriptエンジンだということです。  
(WebKitは、奥が深いです…)

## 他のブラウザたちのレンダリングエンジンとJavaScriptエンジン

ついでに他のブラウザ達で、今、何が使われているのか、まとめました。(2015/01調べ)

| ブラウザ | レンダリングエンジン | JavaScriptエンジン |
| --- | --- | --- |
| IE | Trident | Chakra |
| Chrome | [Blink](http://www.chromium.org/blink) | [V8](https://developers.google.com/v8/intro) |
| Opera | [Blink](http://www.chromium.org/blink) | [V8](https://developers.google.com/v8/intro) |
| Safari | [WebKit](http://www.webkit.org/) | [JavaScriptCore(Nitro)](https://trac.webkit.org/wiki/JavaScriptCore) |
| PhantomJS | [WebKit](http://www.webkit.org/) | [JavaScriptCore(Nitro)](https://trac.webkit.org/wiki/JavaScriptCore) |
| Firefox | [Gecko](https://developer.mozilla.org/en-US/docs/Mozilla/Gecko) | [SpiderMonkey](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey) |

同じエンジンでも搭載されるバージョンが違うなど、挙動が全く同じ。というわけではないので、注意です。参考までに、ブラウザごとのES6の対応状況です

- [ECMAScript 6 compatibility table](http://kangax.github.io/compat-table/es6/)

また、今はこの構成になっていますが、それまでは以下の様な歴史があったようです

- Chromeは、前述したとおりWebKit/V8の構成から、WebKitをforkしたBlinkに移行し、Blink/V8の構成
- Operaは、独自のレンダリングエンジンPrestoと、独自のJavaScriptエンジンCarakanを使っていたが、Chromeに合わせてWebKit/V8 -> Blink/V8の構成に移行

## さいごに

ブラウザ周りはやっぱり、ややこしいなーという印象。ブラウザの歴史を遡ると、ブラウザ戦争の話になったり、2015年にふさわしくないので、省きました。  
とりあえず、Chromeのような自動アップデートが全てのブラウザで有効になって、最新バージョンだけ動作保証していればいい。  
という世界が早く来ることを祈っています。  
あと、そろそろリリースされると噂のPhantomJS2も楽しみですね。
