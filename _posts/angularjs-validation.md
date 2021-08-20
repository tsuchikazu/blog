---
title: "AngularJSでのバリデーションの基本"
date: "2014-12-18"
categories:
  - "フロントエンド"
tags:
  - "angularjs"
  - "javascript"
coverImage: "images/AngularJS-medium.png"
---

この記事は、[AngularJS Advent Calendar 2014 - Adventar](http://www.adventar.org/calendars/350) の19日目の記事となります。前日は、[@albatrosary](https://twitter.com/albatrosary)さんの[YEOMANにあるAngularJS関連ジェネレータをご紹介します - albatrosary's blog](http://albatrosary.hateblo.jp/entry/2014/12/18/184725)です。YEOMANのジェネレータしか使ってこなかったので、他のも触って違いを感じてみたいです。

今日は、AngularJSの基本的なバリデーションの話です。AngularJSの初心者向けの記事になります。最近、仕事でもAngularJSを触り始めているので、少しずつノウハウを公開していきたいと思います。 AngularJSはバリデーション周りで便利な仕組みが色々と用意されていますが、それを拾い集めるのがなかなか大変なため、基本的なことをまとめてみました。

## 前提

### 環境

- AngularJS 1.3

### やりたいこと

- メールアドレスが必須 & 形式 & 文字数チェック
- フォーカスが外れたら、バリデーションエラー表示
- Submitボタンはバリデーションエラーの場合は、非活性

### DEMO

[Plunker](http://plnkr.co/edit/sSEWJzZuIOuXyIdNcbhO?p=preview)

<iframe src="http://embed.plnkr.co/sSEWJzZuIOuXyIdNcbhO/preview" style="width:100%;height:250px;"></iframe>

## バリデーション方法

### 準備(form要素とng-model)

バリデーションするにはform要素で囲み、name属性を指定する必要があります。
form要素もdirectiveになっており、ng-formを指定しても構いません。

```html
<form name="userForm" novalidate>
</form>
```

novalidate属性も追加していますが、これはブラウザによるHTML5のバリデーションと、
AngularJSのバリデーションが同時に実施されてしまうことを避けるために、ブラウザのバリデーションを無効にしています。

バリデーションするinput要素も用意しましょう。name/ng-modelを指定する必要があります。
ng-modelはデータバインディングだけでなく、バリデーションするためにも必要です。

```html
<input type="email" name="email" ng-model="email">
```

### バリデーションする

AngularJSのバリデーションは、基本的にinputなど入力要素に属性を追加していきます。
デフォルトでtextだとng-required(required), ng-pattern, ng-minlength, ng-maxlength等が使えます。
[AngularJS: API: input\[text\]](https://docs.angularjs.org/api/ng/input/input%5Btext%5D)

```html
<input type="email" name="email" ng-model="email" required ng-maxlength="20">
```

必須チェックと最大文字数チェックを追加すると↑の様になります。
標準で用意されているバリデーション以外のチェックをしたい場合にも、基本的にチェック用のdirectiveを用意して属性に指定していきます。

## エラーの表示

どのバリデーションでエラーになったかを、`formのname属性.inputのname属性.$error`で、参照できます。

```js
# エラー内容を出力
{{ userForm.email.$error }}
# 出力内容
{"required":true,"maxlength":true}
```

バリデーションの種類に合わせて、エラーメッセージを出力しましょう。

```html
<span ng-show="userForm.email.$error.required">入力してください</span>
<span ng-show="userForm.email.$error.maxlength">もっと短くして</span>
```

複数のバリデーションをかけた場合、ng-showの条件が冗長になったり、エラーは最初の1つだけ表示したい場合、条件が複雑になってしまいます。 そのため、エラー表示にはngMessagesを使うと便利です([AngularJS: API: ngMessages](https://docs.angularjs.org/api/ngMessages/directive/ngMessages))

```html
<div ng-messages="userForm.email.$error" multiple>
  <div ng-message="required">入力してください</div>
  <div ng-message="maxlength">もっと短くして</div>
</div>
```

さてここで、scopeに何もsetしていないのに、突然userForm.email.$errorを使うことが出来ています。
まず、userFormを使うことができるおは、form directiveにname属性を指定すると、form directiveのcontroller（FormController）が、current scopeに設定されるためです([AngularJS: API: form](https://docs.angularjs.org/api/ng/directive/form))
userForm.emailが突然使えるのも、同じような仕組みです。
ng-model directiveを使うと、ng-model directiveのcontroller（NgModelController）が、親のformに設定されるのです。([AngularJS: API: ngModel](https://docs.angularjs.org/api/ng/directive/ngModel))

### エラー表示タイミング

エラーは表示できましたが、まだ常にエラーメッセージが表示されている状態です。
例えば、フォーカスが外れたタイミングで、バリデーションしてエラーを表示するためには、どうすればいいでしょうか。

AngularJSでは、バリデーションするタイミングを変えるのではなく、エラー表示のタイミングを変える考え方になります。入力項目がvalidかinvalidか（どのバリデーションでエラーになっているか）は、常に保持されているので、出したいタイミングで出してあげます。例えば、以下のようなタイミングで表示できます。

- 常に出す
- focusが外れたら出す
- 値が変更されたら出す
- submitが押されたら出す

表示する or しないの制御には、ng-if or ng-showで制御します。

```html
<div ng-messages="userForm.email.$error" ng-if="userForm.email.$touched && userForm.$submitted">
..
</div>
```

この条件に使うための便利なプロパティをAngularJSは用意してくれています

### NgModelControllerのProperty

それぞれの入力項目ごとに、以下のpropertyを使えます

| Property | Description |
| --- | --- |
| $touched | 一度でもfocusされた |
| $untouched | 一度もfocusされていない($touchedの逆) |
| $dirty | 一度でも値を変更した |
| $pristine | 一度も値を変更されていない($dirtyの逆) |
| $valid | inputの値が正しい |
| $invalid | inputの値が誤っている($validの逆) |

```html
<div ng-messages="userForm.email.$error" ng-if="userForm.email.$touched">
..
</div>
```

### FormControllerのProperty

それぞれの入力項目での条件は、上記のNgModelControllerのpropertyを参照すればいいのですが、 submitボタンが押されたとき等、Form全体に関係するものは、FormControllerのpropertyに用意されています。

| Property | Description |
| --- | --- |
| $dirty | form内のinputを一度でも変更した |
| $pristine | form内のinputが全て変更されていない |
| $valid | form内のinputが全てvalid |
| $invalid | form内のinputにinvalidがある |
| $submitted | formがsubmitされた |

```html
<div ng-messages="userForm.email.$error" ng-if="userForm.$submitted">
..
</div>
```

これらのPropertyは、エラーの表示条件だけでなく、submitボタンの活性非活性の条件などにも使うと便利です。

## まとめ

AngularJSは、今回紹介したFormControllerのpropertyなど、便利なものを標準で提供してくれていて、簡単にバリデーションを実装できます。今回紹介しませんでしたが、propertyと同じようなclass属性も設定してくれるため、デザインを当てる際にも活用できるかと思います。

バリデーションの仕組みが、最初から用意されているのもAngularJSの一つの強みです。これを利用して便利なフォームを作っていきましょう。
