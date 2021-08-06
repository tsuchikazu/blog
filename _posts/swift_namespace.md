---
title: "Swiftの名前空間とは"
date: "2014-09-25"
categories:
  - "ios"
tags:
  - "swift"
coverImage: "images/library.jpg"
---

今月の13、14日にペパボのお産合宿で[音楽位置情報アプリ「Limu」](http://limu.xyz/)を開発しました。というか、まだ完成していないので開発しています。
iPhoneアプリの本格的な開発は今回が初めてでわからないことばかりでしたが、[@nakajijapan](https://twitter.com/nakajijapan)に色々教えてもらって、アプリの作り方がわかってきた今日このごろです。
LimuはSwiftで開発しており、その中で作った一部をライブラリに切り出したりしてるうちに([tsuchikazu/iTunesSwift](https://github.com/tsuchikazu/iTunesSwift))、
Swiftの暗黙的な名前空間(namespace)ってこういうことだったのか、と実感できたのでそれをまとめました。

## 名前空間とは

ここでいう[名前空間](http://ja.wikipedia.org/wiki/%E5%90%8D%E5%89%8D%E7%A9%BA%E9%96%93)とは

> 名前空間はソースコード上で冗長な命名規則を用いなくても名前の衝突が起こらないようにし、しかもそれを容易に記述できるようにするためだけの概念

のことを指しています。特にクラス名の衝突について触れていきます。
Objective-C時代は、この名前空間が存在しないためライブラリを作るときも[AFNetworking](https://github.com/AFNetworking/AFNetworking)のAFみたいな感じで、
変なprefixをつけるしかありませんでした。これは、外部ライブラリとそれを使うアプリ側やライブラリ間でクラス名などが衝突しないようにするためです。

Appleの人曰く、Swiftではこれが解決されており、prefixを付ける必要はないとのことです。

<blockquote class="twitter-tweet" lang="ja"><p>Namespacing is implicit in swift, all classes (etc) are implicitly scoped by the module (Xcode target) they are in. no class prefixes needed</p><p>— Chris Lattner (@clattner_llvm) <a href="https://twitter.com/clattner_llvm/status/474730716941385729">2014, 6月 6</a></p></blockquote>

これを読んでもよくわからないので、実際にライブラリを作って説明していきます。

## Cocoa Touch Frameworkを作って使ってみる

名前空間を理解するために手っ取り早いのは、ライブラリを作って自分で使ってみることです。

### ライブラリを作ってみる

Swiftでライブラリを作るには、Projectの新規作成で`Cocoa Touch Framework`を選択します。
![Cocoa Touch Framework](images/339626751b501f32933255eb938914cd.png)

Product Nameにはライブラリ名を入力します。LanguageはSwiftを選択してください。今回は`NamespaceSwift`で作成しました。
![NamespaceSwift](images/da35c77e6914d0943a55b5e600e9bc35.png)

新規で`Test.swift`ファイルを作り、Testクラスを定義してみます

```
import Foundation
public class Test {

    public init() {
    }

    public func hoge() {
        println("hoge!!!")
    }
}
```

![Test.swift](images/77a73261dac4fd6d376d477b9e8f6108.png)

ライブラリとしてはこれだけで終わりで、一旦閉じておきます。
次に、このライブラリを使うiPhoneアプリを作っていきます。

### ライブラリを使ってみる

適当に`Single View Application`で作ります。
![SingleViewApplication](images/0f498dedbc88210f53c2dc9ad4233802.png)

Product Nameは`NamespaceSwiftDemo`で作成しました。
![NamespaceSwiftDemo](images/ca39f2773a8ad1787239bb56d08af2ab.png)

このアプリで先ほどのライブラリを使うために、ライブラリのxcodeprojをドラッグ&ドロップで持っていきます。
![NamespaceSwiftDrag](images/6c414984e72426aec92529fd06e20a1a.png)

すると NamespaceSwiftDemo > NamespaceSwiftDemo Target > General > Linked Frameworks and Librariesの「+」ボタンで、`NamespaceSwift.framework`が選択出来るようになります。
![LibrarySelect](images/6b63a1a30427e9ec1355fbfa3a3f72ff.png)

これで、ライブラリを使う準備が整いましたので、実際に使ってみます

```
// importしてframeworkを使えるようにします
import NamespaceSwift

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // 先ほど作成したTestクラスを使うことが出来ます
        Test().hoge()

    }
}
```

![UseLibrary](images/bc3f0a7fbd204cad0f647db0ab5c71d6.png)

お疲れ様でした。これで準備が整いました。

## Swiftの名前空間(namespace)を試す

さて、ようやく本題に入ります。

Swiftの名前空間は、JavaのパッケージやPHPのnamespaceのように明示的に指定する方法ではなく、暗黙的に定義されています。Pythonも同じような感じで、暗黙的に定義されるらしいです。
名前空間は、Xcode targetごと（モジュールと呼ぶのが正しいのでしょうか）に定義されるというか、モジュール名がそのまま名前空間になっています。 自分もモジュールとか理解が浅いのですが、簡単に言えばProjectを作成するときのProduct Nameが名前空間になります。

つまり先程のTestクラスは、NamespaceSwiftプロジェクトのTestクラスなので、名前空間を指定してこう書くことができます。

```
// ライブラリのTestクラス
NamespaceSwift.Test().hoge()
```

一方、アプリ側(ライブラリを使っているNamespaceSwiftDemoプロジェクト)で、classを定義すると、NamespaceSwiftDemoが名前空間になります。
そのため、名前空間が別になるので、ライブラリと同じクラス名のTestクラスを作成することができます。

```
import Foundation
public class Test {

    public init() {
    }

    public func fuga() {
        println("fuga!!!!!!!")
    }
}
```

![TestClassDuplicate](images/f8450ae91d20517dd4ddc88b53922958.png)

名前空間を指定することで、クラス名が衝突しても同時に使うことができるのです。

```
// ライブラリのTestクラス
NamespaceSwift.Test().hoge()

// アプリのTestクラス
NamespaceSwiftDemo.Test().fuga()

// 名前空間指定しない場合は、自分の名前空間から探してあればそれ、無ければ別の名前空間を探しにいく
// アプリのTestクラスになる
Test().fuga()
```

![Use](images/844bbd929631ad46e453fd675ee7fd61.png)

### ハマリポイント

個人的にものすごくハマったポイントがありました。 名前空間（モジュール名）と同じクラス名を定義すると、名前空間として解釈されずにクラスとして解釈されてしまうという点です。

```
// 名前空間と同じクラス
class NamespaceSwift {

}

// 名前空間と同じクラス
class NamespaceSwiftDemo {

}
```

![](images/2c11db4c894413c559c400e4f4f9708b.png)

これは、個人的にはバグなんじゃないかと思っているんですけど、モジュール名は非常に気を使う必要がありそうです。

## まとめ

ということで、Swiftには暗黙的に名前空間が存在しており、知らずのうちにその中でclassを作っていたのでした。 これがあるお陰で、今後はライブラリに変なprefixをつける必要がなくなりました。 名前の衝突を気にせず、本来あるべき名前をつけていきましょう。 紹介したプログラムはGitHubにあげていますので、ぜひ試してみてください。[tsuchikazu/NamespaceSwiftDemo](https://github.com/tsuchikazu/NamespaceSwiftDemo)
（認識違いなどあると思いますので、詳しい人教えてください）
