---
title: "Macで作るRails環境構築手順"
date: "2013-11-17"
categories: 
  - "開発環境"
tags: 
  - "gem"
  - "homebrew"
  - "mysql"
  - "ruby"
  - "ruby-on-rails"
coverImage: "mac_rails.jpg"
---

最近、非エンジニアのMacにRails環境を、ゼロから構築する機会がありましたので、手順を残しておきます。かなり王道な方法だと思いますので、これからMacで開発したいという人は参考になるかと思います。

## Homebrewをインストール

Homebrewというのは、デフォルトでは利用できない便利なツールを、インストールしたりアンインストールしたり管理するツールです。 これがないとMacでの開発は何も出来ません。

これをインストールするためには、`Command Line Tools for Xcode`を先にインストールする必要があります。

### Command Line Tools for Xcodeのインストール

Command Line Toolsをインストールすると、Homebrew内で使用されているコンパイラやgitなど、基本的なツールを使うことが出来ます。

以前まではXcodeをインストールしなければ、Command Line Toolsをインストールすることが出来ませんでしたが、 単体でもインストールすることが出来るようになりました。 （XcodeはiPhone開発に使用するソフトです）

[Downloads](https://developer.apple.com/downloads/index.action) このページからOSに合わせたCommand Line Toolsをインストールしてください。（AppleIDでのログインが必要です）

例：Command Line Tools (OS X Mavericks) for Xcode

インストール参考記事：[XcodeからCommand Line Tools for Xcodeに切り替えたらHDD使用容量が7GB減った - Glide Note - グライドノート](http://blog.glidenote.com/blog/2012/02/20/command-line-tools-for-xcode/)

参考までにインストールされるツールの一覧です

```
 $ pkgutil --payload-files /Volumes/Command\ Line\ Developer\ Tools/Packages/CLTools_Executables.pkg|grep bin               [~]
 ./Library/Developer/CommandLineTools/usr/bin
 ./Library/Developer/CommandLineTools/usr/bin/BuildStrings
 ./Library/Developer/CommandLineTools/usr/bin/CpMac
 ./Library/Developer/CommandLineTools/usr/bin/DeRez
 ./Library/Developer/CommandLineTools/usr/bin/GetFileInfo
 ./Library/Developer/CommandLineTools/usr/bin/MergePef
 ./Library/Developer/CommandLineTools/usr/bin/MvMac
 ./Library/Developer/CommandLineTools/usr/bin/ResMerger
 ./Library/Developer/CommandLineTools/usr/bin/Rez
 ./Library/Developer/CommandLineTools/usr/bin/RezDet
 ./Library/Developer/CommandLineTools/usr/bin/RezWack
 ./Library/Developer/CommandLineTools/usr/bin/SetFile
 ./Library/Developer/CommandLineTools/usr/bin/SplitForks
 ./Library/Developer/CommandLineTools/usr/bin/UnRezWack
 ./Library/Developer/CommandLineTools/usr/bin/git
 ./Library/Developer/CommandLineTools/usr/bin/git-cvsserver
 ./Library/Developer/CommandLineTools/usr/bin/git-receive-pack
 ./Library/Developer/CommandLineTools/usr/bin/git-shell
 ./Library/Developer/CommandLineTools/usr/bin/git-upload-archive
 ./Library/Developer/CommandLineTools/usr/bin/git-upload-pack
 ./Library/Developer/CommandLineTools/usr/bin/bison
 ./Library/Developer/CommandLineTools/usr/bin/yacc
 ./Library/Developer/CommandLineTools/usr/bin/mig
 ./Library/Developer/CommandLineTools/usr/bin/ar
 ./Library/Developer/CommandLineTools/usr/bin/as
 ./Library/Developer/CommandLineTools/usr/bin/cmpdylib
 ./Library/Developer/CommandLineTools/usr/bin/codesign_allocate
 ./Library/Developer/CommandLineTools/usr/bin/ctf_insert
 ./Library/Developer/CommandLineTools/usr/bin/install_name_tool
 ./Library/Developer/CommandLineTools/usr/bin/libtool
 ./Library/Developer/CommandLineTools/usr/bin/lipo
 ./Library/Developer/CommandLineTools/usr/bin/nm
 ./Library/Developer/CommandLineTools/usr/bin/nmedit
 ./Library/Developer/CommandLineTools/usr/bin/otool
 ./Library/Developer/CommandLineTools/usr/bin/pagestuff
 ./Library/Developer/CommandLineTools/usr/bin/ranlib
 ./Library/Developer/CommandLineTools/usr/bin/redo_prebinding
 ./Library/Developer/CommandLineTools/usr/bin/segedit
 ./Library/Developer/CommandLineTools/usr/bin/size
 ./Library/Developer/CommandLineTools/usr/bin/strings
 ./Library/Developer/CommandLineTools/usr/bin/strip
 ./Library/Developer/CommandLineTools/usr/share/man/man1/redo_prebinding.1
 ./Library/Developer/CommandLineTools/usr/bin/c++
 ./Library/Developer/CommandLineTools/usr/bin/cc
 ./Library/Developer/CommandLineTools/usr/bin/clang
 ./Library/Developer/CommandLineTools/usr/bin/clang++
 ./Library/Developer/CommandLineTools/usr/bin/asa
 ./Library/Developer/CommandLineTools/usr/bin/ctags
 ./Library/Developer/CommandLineTools/usr/bin/indent
 ./Library/Developer/CommandLineTools/usr/bin/lorder
 ./Library/Developer/CommandLineTools/usr/bin/mkdep
 ./Library/Developer/CommandLineTools/usr/bin/rpcgen
 ./Library/Developer/CommandLineTools/usr/bin/unifdef
 ./Library/Developer/CommandLineTools/usr/bin/unifdefall
 ./Library/Developer/CommandLineTools/usr/bin/what
 ./Library/Developer/CommandLineTools/usr/bin/dsymutil
 ./Library/Developer/CommandLineTools/usr/bin/dwarfdump
 ./Library/Developer/CommandLineTools/usr/bin/flex
 ./Library/Developer/CommandLineTools/usr/bin/flex++
 ./Library/Developer/CommandLineTools/usr/bin/lex
 ./Library/Developer/CommandLineTools/usr/bin/c89
 ./Library/Developer/CommandLineTools/usr/bin/c99
 ./Library/Developer/CommandLineTools/usr/bin/cpp
 ./Library/Developer/CommandLineTools/usr/bin/g++
 ./Library/Developer/CommandLineTools/usr/bin/gcc
 ./Library/Developer/CommandLineTools/usr/bin/gcov
 ./Library/Developer/CommandLineTools/usr/bin/gm4
 ./Library/Developer/CommandLineTools/usr/bin/m4
 ./Library/Developer/CommandLineTools/usr/bin/gnumake
 ./Library/Developer/CommandLineTools/usr/bin/make
 ./Library/Developer/CommandLineTools/usr/bin/gperf
 ./Library/Developer/CommandLineTools/usr/bin/gatherheaderdoc
 ./Library/Developer/CommandLineTools/usr/bin/hdxml2manxml
 ./Library/Developer/CommandLineTools/usr/bin/headerdoc2html
 ./Library/Developer/CommandLineTools/usr/bin/resolveLinks
 ./Library/Developer/CommandLineTools/usr/bin/xml2man
 ./Library/Developer/CommandLineTools/usr/bin/dyldinfo
 ./Library/Developer/CommandLineTools/usr/bin/ld
 ./Library/Developer/CommandLineTools/usr/bin/rebase
 ./Library/Developer/CommandLineTools/usr/bin/unwinddump
 ./Library/Developer/CommandLineTools/usr/bin/lldb
 ./Library/Developer/CommandLineTools/usr/bin/nasm
 ./Library/Developer/CommandLineTools/usr/bin/ndisasm
 ./Library/Developer/CommandLineTools/usr/bin/projectInfo
 ./Library/Developer/CommandLineTools/usr/bin/svn
 ./Library/Developer/CommandLineTools/usr/bin/svnadmin
 ./Library/Developer/CommandLineTools/usr/bin/svndumpfilter
 ./Library/Developer/CommandLineTools/usr/bin/svnlook
 ./Library/Developer/CommandLineTools/usr/bin/svnrdump
 ./Library/Developer/CommandLineTools/usr/bin/svnserve
 ./Library/Developer/CommandLineTools/usr/bin/svnsync
 ./Library/Developer/CommandLineTools/usr/bin/svnversion
```

### Homebrewをインストール

Command Line Toolsをインストールしたら、Homebrewをインストールする準備が整いました。 公式ページ[Homebrew — MacPortsは酒でも飲みたくなるでしょ？使おうHomeBrew！](http://brew.sh/index_ja.html)にも記載されいるインストールコマンドを叩きましょう。

これは、Macに最初からインストールされているターミナルアプリ（黒い画面）を起動して、実行します。ターミナルアプリは、Spotlightで`terminal`で検索するとHitするはずです。ターミナルアプリの黒い画面が開いたら、以下のコマンドを実行しましょう（$は打たないでください）

```
 $ ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
 $ brew -v
 Homebrew 0.9.5
```

最後に`Homebrew X.X.X`が表示されればインストール完了です。この先、このターミナルアプリ（黒か白の画面）上で、作業を進めていきます。

## rubyをインストール

デフォルトで入っているrubyより、最新のrubyをインストールして使用します。そのために、`rbenv`というツールをインストールします。

### rbenvをインストール

rbenvとは、rubyのバージョンを管理してくれるツールです。最新の2系や1.9系のrubyの切替が簡単に可能になります。

rbenvは先ほどインストールしたHomebrewを使用して、インストールします。

```
 $ brew update
 $ brew install rbenv ruby-build
 $ echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
 $ source ~/.bash_profile
```

rbenvの使い方は[Ruby - Mountain Lion環境への「rbenv」のインストール手順 + 設定方法 - Qiita \[キータ\]](http://qiita.com/skinoshita/items/2cf0c27a6ff4f0602568#2-4)を参照。

### rubyをインストール

以下のコマンドを実行していきます。

```
 $ rbenv install -l # 2.0.0-pXXXを探してください
 $ rbenv install 2.0.0-pXXX # 上で探した2.0.0-pXXXを入力
 $ rbenv rehash
 $ rbenv global 2.0.0-pXXX # 上で指定した2.0.0-pXXXを入力
 $ ruby -v # 2.0.0-pXXXが表示されることを確認
```

## MySQLをインストール

Homebrew で MySQL をインストールします。

```
 $ brew install mysql
```

初期設定をしていきます

```
 $ unset TMPDIR
 $ mysql_install_db --verbose --user=`whoami` --basedir="$(brew --prefix mysql)" --datadir=/usr/local/var/mysql --tmpdir=/tmp
 $ # 起動時に MySQL を立ち上げる。
 $ ln -sfv /usr/local/opt/mysql/*.plist ~/Library/LaunchAgents 
 $ launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
```

## Powをインストール

powは設定が不要なRails & Rackサーバということで、railsアプリの動作確認が楽になります。

```
 $ gem install powder
 $ rbenv rehash
 $ powder install
```

## Railsアプリの作成準備

必要最低限なgemをインストールします。それ以外は、Bundlerで管理することになるはずです。

```
 $ gem install bundler
 $ gem install rails
 $ rbenv rehash
```

お疲れ様でした。ここまで来たら`rails new`コマンドでrailsアプリを作成していけます。最初に構築しておけば、今後便利になるものばかりインストールしました。それでは素敵なMac開発ライフを。

\[amazonjs asin="4774165166" locale="JP" title="パーフェクト Ruby on Rails"\]
