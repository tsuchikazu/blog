---
title: "Macにnvm + Node.jsで環境構築"
date: "2013-08-26"
categories:
  - "node-js"
  - "開発環境"
tags:
  - "js"
  - "node"
  - "nvm"
coverImage: "images/medium_7373029404.jpg"
---

この間、LLまつりに参加してみて、JSがとても奥深そうで一番興味が惹かれました。Node.jsは、これまで一度も触ったことがなかったので、とりあえず、はじめてのNode.jsを読みながら、色々試してみようかと思います。

この記事では、nvmでNode.jsをインストールして、HelloWorldを表示するまでをまとめました。

### node.jsのインストール

公式サイト[node.js](http://nodejs.org/images/logo.png)に行くと、Mac OS用のInstallerやBinaryがすでに用意されています。 しかし、Node.jsの更新頻度が高いこともあり、nodeバージョン管理を利用するほうがいいでしょう。

| Node version manager | stars |
| --- | --- |
| [creationix/nvm](https://github.com/creationix/nvm) | ★2,247 |
| [isaacs/nave](https://github.com/isaacs/nave) | ★488 |
| [hokaccha/nodebrew](https://github.com/hokaccha/nodebrew) | ★171 |

いくつかのバージョン管理が存在しますが、star数が(2013/08/27現在）一番多い[creationix/nvm](https://github.com/creationix/nvm)がオススメです。rubyでいうrvmでお馴染みの方も多いでしょう。githubに記載されている手順でインストールしていきます。

1. install scriptの実行

    ```
      $ curl https://raw.github.com/creationix/nvm/master/install.sh | sh
        % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                       Dload  Upload   Total   Spent    Left  Speed
      100  1391  100  1391    0     0    324      0  0:00:04  0:00:04 --:--:-- 422
      Cloning into '/Users/tsuchikazu/.nvm'...
      remote: Counting objects: 723, done.
      remote: Compressing objects: 100% (488/488), done.
      remote: Total 723 (delta 352), reused 574 (delta 224)
      Receiving objects: 100% (723/723), 110.21 KiB | 69 KiB/s, done.
      Resolving deltas: 100% (352/352), done.

      => Appending source string to /Users/tsuchikazu/.bash_profile
      => Close and reopen your terminal to start using NVM
    ```

    これで`~/.nvm/`にcloneされて、`~/.bash_profile`に設定が追加されたようです。自分の環境はzshなので、`~/.zshrc`にも追加しておきます。

    ```
      $ echo "[[ -s /Users/tsuchikazu/.nvm/nvm.sh ]] && . /Users/tsuchikazu/.nvm/nvm.sh # This loads NVM" >> ~/.zshrc
    ```

2. shellの再起動

    ```
      $ exec $SHELL -l
    ```

    shellのファイル内容を反映させます。すると`nvm`コマンドが使用可能になります

3. nvmコマンドの使い方

    ```
      $ nvm

      Node Version Manager

      Usage:
          nvm help                    Show this message
          nvm install [-s] <version>  Download and install a <version>
          nvm uninstall <version>     Uninstall a version
          nvm use <version>           Modify PATH to use <version>
          nvm run <version> [<args>]  Run <version> with <args> as arguments
          nvm ls                      List installed versions
          nvm ls <version>            List versions matching a given description
          nvm ls-remote               List remote versions available for install
          nvm deactivate              Undo effects of NVM on current shell
          nvm alias [<pattern>]       Show all aliases beginning with <pattern>
          nvm alias <name> <version>  Set an alias named <name> pointing to <version>
          nvm unalias <name>          Deletes the alias named <name>
          nvm copy-packages <version> Install global NPM packages contained in <version> to current version

      Example:
          nvm install v0.4.12         Install a specific version number
          nvm use 0.2                 Use the latest available 0.2.x release
          nvm run 0.4.12 myApp.js     Run myApp.js using node v0.4.12
          nvm alias default 0.4       Auto use the latest installed v0.4.x versionu
    ```

    今どきのコマンドは適当にコマンド打つだけで、使い方がわかって便利ですね

4. 最新バージョンの確認

    ```
      $ nvm ls-remote
      ...省略
      v0.10.15
      v0.10.16
      v0.10.17
      v0.11.0
      v0.11.1
      v0.11.2
      v0.11.3
      v0.11.4
      v0.11.5
      v0.11.6
    ```

    基本的に一つ前のマイナーバージョンが安定版、一番新しいバージョンが開発版のようです。今回は安定版をインストールします。

5. node安定版のインストール

    ```
      $ nvm install v0.10.17
      ######################################################################## 100.0%
      Now using node v0.10.17
      $ node -v
      v0.10.171
    ```

    簡単にインストール出来ましたね。


### 始めの一歩。Hello Worldを表示しよう

1. 実行ファイルの用意

    ```
      console.log("Hello World!");
    ```

    この内容でhello.jsという名前で保存しておきましょう

2. 実行

    ```
     $ node hello.js
     Hello World!
    ```


いかがだったでしょうか？パッケージ管理を使うと簡単にNode.jsをインストール出来ました。さらに、バージョンアップの際も簡単に最新版に切り替えられます。それでは、快適ななNode.jsライフを！
