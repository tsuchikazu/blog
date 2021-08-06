---
title: "Nuxt.jsのPage ComponentのStorybook化"
date: "2019-12-01"
categories:
  - "フロントエンド"
coverImage: "images/1_8vntpfJ8_FQ1XkeMVggasQ.png"
---

これは、[Nuxt.js Advent Calendar 2019](https://qiita.com/advent-calendar/2019/nuxt-js) 1日目の記事です。

今の職場では、Vue Fes 2018で発表した [1年間単体テストを書き続けた現場から送る Vue Component のテスト](https://speakerdeck.com/tsuchikazu/vue-component-test) の通り、Storybook + reg-suit を利用したVisual Regression Testingを今でも継続してやっています。 Storybookの本来の用途である、いわゆるcomponentのカタログとして使うよりも、pageなど大きな粒度のcomponentの見た目のテストのためにStroybookを利用しています。これはテストに利用するということを考えると、設計の可動域を確保し今後のリファクタリングなど変更のしやすさを考えると、より大きな粒度のテストにしておいたほうがよいだろうという判断をしています。(もちろん、それだけで全てのテストケースを網羅するのではなく、場合によっては細かい粒度のcomponentでもテストをします)

## layout + Page ComponentをStorybookで表示したい

今のプロジェクトではNuxtを採用しており、より大きな粒度でのテストを目指すと、layout + Page Componentでのテストがしたくなってきます。そうなると、無理にStorybookでやらなくても、E2Eのように実際にアプリを動かしpuppeteerなどでキャプチャすればいいのでは？という道もありますが、APIのレスポンスによって表示を切り替えるロジックが多く入っており、レスポンスを簡単に変更する手段として、Storybookを採用しています。Storybookでは(レスポンス自体を変更しているわけではないが、実質的に一緒)、vuexのstateのパターンを増やしたり、後述する `data` の上書きによって、データパターン切り替えが簡単にできます。 しかし、基本的にStorybookはVue単体で動作するため、NuxtによるVueの拡張がされている部分については、動作しません。具体的に、大きな問題となったのは以下の部分です。

1. layoutと一緒に表示できない
2. asyncDataと連携できない

### layoutと一緒に表示できない

nuxtにはlayout機能が備わっているため、普通にページを表示するとlayoutファイルの内容と一緒にpage componentが表示されます。Storybookで単純にpage componentを表示したところで、Vue単体ではlayoutは認識しないため、page componentだけが表示されます。

```
import Top from '~/pages/top.vue'

// Top componentしか表示されない
storiesOf('Top', module)
  .add('xxxxのとき', () => ({
    components: { Top },
    template: '<top/>'
  }))
```

layoutと一緒にpage componentを表示したい。というのがやりたいことです。

```
<template>
  <div>
    <my-header />
    <nuxt />
    <my-footer />
  </div>
</template>
```

layoutファイルのサンプルはこのような形で、`<nuxt />` が、各page componentで置き換わる部分です。そのため、layoutを親componentとして指定し、`<nuxt />` を `<slot />` と同じ動きにしてあげれば、通常のVueでもやりたいことができそうです。

laoutを親componentへ指定

```
import Layout from '~/layouts/default.vue'
import Top from '~/pages/top.vue'

storiesOf('Top', module)
  .add('xxxxのとき', () => ({
    components: { Layout, Top },
    template: '<layout><top/></layout>'
  }))
```

`<nuxt />` で、`<slot />` の動きを、無理やり模倣

```
Vue.component('nuxt', {
  render() {
    // <nuxt> から見ると、$parent が layout ファイル。layoutに指定されているslot = page componentを表示するだけ
    return this.$parent.$slots.default
  }
})
```

これで、layoutとpage componentを表示できるようになりました

### asyncDataと連携できない

`asyncData` はnuxtで追加されたLifecycle Hookのようなもので、componentがインスタンスされる前に呼び出され、戻り値は `data` とマージされて、componentで利用できます。APIを呼び出してデータ取得する等の用途に使われるもので、今のプロジェクトでも、そのページでしか使わないAPIから取得した情報は、Vuexで管理するのではなく `asyncData` で取得して、`data` として利用する。という方針にしており、 `asyncData` が多用されています。

例によって、Storybookでは `asyncData` は無視されます。その結果、本来 `asyncData` でreturnして `data` とマージされアクセスできるはずの `this.xxxx` が定義されていないエラーとなってしまいます。

これも割と無理やりな方法なのですが、テスト対象のpage comnponentを継承し、`data` を上書きして表示することで、回避しています。

```
storiesOf('Top', module)
  .add('xxxxのとき', () => ({
    components: {
      Layout,
      Top: {
        extends: Top,
        data () {
          // asyncData で return しているものを、仮で設定
          fetchedData: {xxx: 'xxxx'}
        }
      }
    },
    template: '<layout><top/></layout>'
  }))
```

これを利用すると、dataの情報を自由に設定してStorybookに表示して、Visual Testingできるようになるのですが、実装に依存しすぎるテストになってしまうため、asyncData で戻すものぐらいにしておく方がいいかなと考えています。

## まとめ

Nuxtのプロジェクトで、page componentを対象にStorybook + reg-suit での Visual Regression Testをする際に、詰まった部分と回避策を紹介しました。Storybook本来の役割とは違っていますが、見た目に関するテストは負荷なく継続することができています(というか、大変便利です)。 今のプロジェクトのStorybookは、page componentでいっぱいです。みなさんのStorybookは、どうなっているでしょうか？ぜひ教えて下さい。

明日は [@m\_mitsuhide](https://qiita.com/m_mitsuhide) さんでTypeScript関連で書く予定です！
