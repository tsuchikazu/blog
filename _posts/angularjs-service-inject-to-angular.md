---
title: "AngularJSの組み込みのservice($location等)をAngularへDIする方法"
date: "2020-06-22"
categories: 
  - "angularjs"
  - "フロントエンド"
---

最近、仕事でAngularJSからAngularへのアップグレードをしています。その辺りのことは、[ペパボ EC テックカンファレンス](https://pepabo.connpass.com/event/179445/)でも同僚の[@ku00\_](https://twitter.com/ku00_)がトークするので、興味のある方はそちらもどうぞ。

今のプロジェクトでは、[ngUpgrade](https://angular.jp/guide/upgrade#ngupgrade-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9F%E3%82%A2%E3%83%83%E3%83%97%E3%82%B0%E3%83%AC%E3%83%BC%E3%83%89) を利用してAngularJSとAngularを共存させる形で、徐々に移行しています。

その際に詰まった所が、調べても中々hitしなかったので、ブログにしておきます。

### 問題

ngUpgradeを利用して、AngularJsとAngularのハイブリットのアプリケーションを動かす時、Angularコンポーネントの中でAngularJSの組み込みのservice達 ($location, $log等) を使いたいケースがありました。

具体的に自分たちに起きたケースとしては、ボトムアップ的にAngularへの置き換えをしている中で、AngularからAngularJSで定義しているrouteへ遷移したいというものです。AngularJSでは、 `$location.path('/newRoute')` を呼び出せばいいだけですが、それをAngularでやるにはどうすればいいでしょうか？

### 解決方法

公式ドキュメントを読むと、[AngularJS の依存性を Angular に注入できるようにする](https://angular.jp/guide/upgrade#angularjs-%E3%81%AE%E4%BE%9D%E5%AD%98%E6%80%A7%E3%82%92-angular-%E3%81%AB%E6%B3%A8%E5%85%A5%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B) という セクションがあります。これをすると、AngularJSの世界からAngularの世界へDIが可能になるようです。

サンプルとして書かれていたものは、組み込みのserviceではなく、自作のserviceの方法でした。

```
import { HeroesService } from './heroes.service';

@NgModule({
  providers: [
    {
       provide: HeroesService,
       useFactory: ($injector: any) => $injector.get('heros'),
       deps: ['$injector']
    }
  ]
})
```

DIするときは、普通に型でDI出来ます。

```
  constructor(heroesService: HeroesService) {}
```

これで `providers` に指定しているのは、[FactoryProvider](https://angular.jp/api/core/FactoryProvider) と呼ばれるものです。`provide` には、型や[InjectionToken](https://angular.jp/api/core/InjectionToken) と呼ばれる文字列を指定することが出来て、どのような形でDIするかが、ここの指定によって変わります。classを指定した場合は、そのclassでinjection出来ます。ただし、interfaceを指定することは出来ないため、AngularJSの組み込みserviceを指定する場合は文字列がよさそうです。

`useFactory` 関数ではDIする実体を決定できて、`$injector` を使うとAngularJSの世界でDI可能なものを取得できるので、それを利用しているようです。

`$location` のようなAngularJSなどの組み込みのserviceをDIする例です。

```
@NgModule({
  providers: [
    {
       provide: '$location',
       useFactory: ($injector: any) => $injector.get('$location'),
       deps: ['$injector']
    }
  ]
})
```

DIするとき

```
  constructor(@Inject('$location') $location) {}
```

このように、`provide` で文字列を指定した場合は、DIするときに `@Inject` を利用する必要があります。Angularの providers がやっていることやDIが、なんとなくわかってきたような気がします。
