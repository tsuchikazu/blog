---
title: "HerokuのログをBigQueryへエクスポートする"
date: "2020-06-22"
categories: 
  - "ruby"
  - "開発環境"
coverImage: "heroku.jpg"
---

Herokuのログはどんどん流れていってしまうため、どこかに保存しなくてはなりません。そのため、[Papertrail](https://elements.heroku.com/addons/papertrail)や[Coralogix Logging](https://elements.heroku.com/addons/coralogix)などのaddonを使って、外部サービスへlogを流して、そちらである程度の期間分、永続化するなり、検索して活用するなどしているかと思います。大量のアクセスがきて大量のログが流れるアプリケーションの場合、ログが大量になりプランアップにしなければならなくなり、addon料金も馬鹿にならない。ということになったりしないでしょうか？

そこで、addonを使用せずにGoogle BigQueryへログを転送して、利便性を損なわずにコストダウンを図るということをやってみたので、それの紹介です。ざっくりの概要としてはこのような形。

[![heroku_log_to_big_query](images/image-10.png)](https://tsuchikazu.net/wp-content/uploads/2020/06/image-10.png)

### Loggingライブラリ

Heroku上のアプリから、Loggingライブラリなどを利用して、Cloud Loggingへ書き込みます。各言語で[Loggingライブラリ](https://cloud.google.com/logging/docs/setup?hl=ja)は用意されているので、それを使うのが手っ取り早いです。

自分の場合は、railsだったため、[stackdriver gem](https://github.com/googleapis/google-cloud-ruby/tree/master/stackdriver) を利用しました。ログはjsonにして送るほうが便利なため、リクエストログについては、[lograge](https://github.com/roidrage/lograge)を利用しています。

[stackdriver gem](https://github.com/googleapis/google-cloud-ruby/tree/master/stackdriver) では、Cloud Loggingへ書き込みに行くためのサービスアカウントの認証情報についてはjsonで用意するのが通常の方法ですが、環境変数で指定したほうが環境で切り替えやすく、secretな情報をcommitしなくても済むため、そちらを採用しました。以下の環境変数を設定すればOKです。

```
GOOGLE_ACCOUNT_TYPE=
GOOGLE_PROJECT_ID=
GOOGLE_PRIVATE_KEY=
GOOGLE_CLIENT_EMAIL=
GOOGLE_CLIENT_ID=
```

ログ出力時にgRPCでリクエストされるため、多少オーバーヘッドが増えそうですが、今の所問題にはなっていません。

### 集約シンク

Cloud Loggingでのデータの保持期間は、デフォルトで30日です。それ以上の日数を保存するには、カスタム保持で設定可能ですが、まだbetaです。 [集約シンク](https://cloud.google.com/logging/docs/export/aggregated_sinks?hl=ja)を使うと、Cloud StorageやPub/Sub、BigQueryへエクスポートすることが出来ます。

stackdriver gemで作成したログは、

```
log_name="projects/#{project_id}/logs/#{log_name}"
```

このような感じでCloud Logging上で検索可能なため、それに対してシンクの設定をすればOKです。

### 料金の見積もり

360MB/dayほどのログを出力するアプリに対して、ざっくり見積もりしてみたところ、詳細は省きますが、以下のようになりました。

- papertrailの場合
    
    - $65/月
- CloudLogging + BigQuery
    
    - $8.5/月

あくまで保存するだけ料金でもあるため、実際にQueryを実行すると追加で課金されたりするため、ざっくりの目安として載せておきます。

以上、Heroku上のアプリログをBigQueryにexportする話でした。
