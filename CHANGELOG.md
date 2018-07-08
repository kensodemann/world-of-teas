<a name="0.0.1-4"></a>
## [0.0.1-4](https://github.com/kensodemann/world-of-teas/compare/v0.0.1-3...v0.0.1-4) (2018-07-08)


### Bug Fixes

* **e2e:** correct the button selector ([#91](https://github.com/kensodemann/world-of-teas/issues/91)) ([f81750f](https://github.com/kensodemann/world-of-teas/commit/f81750f))
* **teas:** fix the SQL for the teas endpoint ([#102](https://github.com/kensodemann/world-of-teas/issues/102)) ([c877ce6](https://github.com/kensodemann/world-of-teas/commit/c877ce6))
* **test:** clean up the e2e tests ([79792fa](https://github.com/kensodemann/world-of-teas/commit/79792fa))
* **test:** clean up the unit tests ([14aab12](https://github.com/kensodemann/world-of-teas/commit/14aab12))


### Features

* **categories:** fill out the tea categories ([#105](https://github.com/kensodemann/world-of-teas/issues/105)) ([d1f9926](https://github.com/kensodemann/world-of-teas/commit/d1f9926))
* **security:** experiment just port 8100 ([6d74c0a](https://github.com/kensodemann/world-of-teas/commit/6d74c0a))
* **security:** experiment with restrictive ACAO ([8d1212d](https://github.com/kensodemann/world-of-teas/commit/8d1212d))
* **security:** experiment with slightly less restrictive ACAO ([3f79123](https://github.com/kensodemann/world-of-teas/commit/3f79123))
* **security:** set allow origin via env ([7287fcd](https://github.com/kensodemann/world-of-teas/commit/7287fcd))
* **tea:** add purchase links to the data store ([#100](https://github.com/kensodemann/world-of-teas/issues/100)) ([342d1d8](https://github.com/kensodemann/world-of-teas/commit/342d1d8)), closes [#98](https://github.com/kensodemann/world-of-teas/issues/98)
* **tea:** add tea related tables ([#86](https://github.com/kensodemann/world-of-teas/issues/86)) ([d02bf27](https://github.com/kensodemann/world-of-teas/commit/d02bf27))
* **tea:** add teas to the store ([#97](https://github.com/kensodemann/world-of-teas/issues/97)) ([d059569](https://github.com/kensodemann/world-of-teas/commit/d059569)), closes [#90](https://github.com/kensodemann/world-of-teas/issues/90)
* **tea:** add the tea purchase links endpoints ([#96](https://github.com/kensodemann/world-of-teas/issues/96)) ([dd37045](https://github.com/kensodemann/world-of-teas/commit/dd37045)), closes [#85](https://github.com/kensodemann/world-of-teas/issues/85)
* **tea:** add the teas endpoint ([#92](https://github.com/kensodemann/world-of-teas/issues/92)) ([46769a6](https://github.com/kensodemann/world-of-teas/commit/46769a6)), closes [#36](https://github.com/kensodemann/world-of-teas/issues/36)
* **tea:** create the tea API service ([#95](https://github.com/kensodemann/world-of-teas/issues/95)) ([4797023](https://github.com/kensodemann/world-of-teas/commit/4797023)), closes [#89](https://github.com/kensodemann/world-of-teas/issues/89)
* **tea:** create the tea purchase links API service ([#99](https://github.com/kensodemann/world-of-teas/issues/99)) ([2c784fd](https://github.com/kensodemann/world-of-teas/commit/2c784fd)), closes [#93](https://github.com/kensodemann/world-of-teas/issues/93)
* **tea:** make the table names plural ([#88](https://github.com/kensodemann/world-of-teas/issues/88)) ([f8a91b5](https://github.com/kensodemann/world-of-teas/commit/f8a91b5))
* **tea:** mock up the tea editor ([#79](https://github.com/kensodemann/world-of-teas/issues/79)) ([a526f09](https://github.com/kensodemann/world-of-teas/commit/a526f09))
* **tea-categories:** add tea-categories to the store ([#103](https://github.com/kensodemann/world-of-teas/issues/103)) ([58cca33](https://github.com/kensodemann/world-of-teas/commit/58cca33))



<a name="0.0.1-3"></a>
## [0.0.1-3](https://github.com/kensodemann/world-of-teas/compare/v0.0.1-2...v0.0.1-3) (2018-01-23)


### Bug Fixes

* **libraries:** pin bootstrap and bootstrap-vue to specific versions ([#67](https://github.com/kensodemann/world-of-teas/issues/67)) ([4a7f3a6](https://github.com/kensodemann/world-of-teas/commit/4a7f3a6))
* **sql:** use camel case for column names ([#55](https://github.com/kensodemann/world-of-teas/issues/55)) ([0b50b9c](https://github.com/kensodemann/world-of-teas/commit/0b50b9c))
* **unit tests:** silence the data mocking ([#48](https://github.com/kensodemann/world-of-teas/issues/48)) ([c38d966](https://github.com/kensodemann/world-of-teas/commit/c38d966))
* **users:** fix the user route handling ([#59](https://github.com/kensodemann/world-of-teas/issues/59)) ([83e5215](https://github.com/kensodemann/world-of-teas/commit/83e5215))


### Features

* **auth:** add login and logout endpoints ([#64](https://github.com/kensodemann/world-of-teas/issues/64)) ([5927ab5](https://github.com/kensodemann/world-of-teas/commit/5927ab5)), closes [#62](https://github.com/kensodemann/world-of-teas/issues/62)
* **authentication:** add  password checking routine ([#49](https://github.com/kensodemann/world-of-teas/issues/49)) ([610247e](https://github.com/kensodemann/world-of-teas/commit/610247e))
* **authentication:** add a change password page ([#74](https://github.com/kensodemann/world-of-teas/issues/74)) ([6d3efa3](https://github.com/kensodemann/world-of-teas/commit/6d3efa3)), closes [#34](https://github.com/kensodemann/world-of-teas/issues/34)
* **authentication:** add the profile page ([#75](https://github.com/kensodemann/world-of-teas/issues/75)) ([7324be9](https://github.com/kensodemann/world-of-teas/commit/7324be9)), closes [#33](https://github.com/kensodemann/world-of-teas/issues/33)
* **authentication:** change login menu on login ([#66](https://github.com/kensodemann/world-of-teas/issues/66)) ([84c0e62](https://github.com/kensodemann/world-of-teas/commit/84c0e62))
* **authentication:** configure passport ([#50](https://github.com/kensodemann/world-of-teas/issues/50)) ([cacb1c1](https://github.com/kensodemann/world-of-teas/commit/cacb1c1))
* **authentication:** create the encryption service ([#47](https://github.com/kensodemann/world-of-teas/issues/47)) ([b8e92a2](https://github.com/kensodemann/world-of-teas/commit/b8e92a2))
* **authentidation:** create authentication service ([#51](https://github.com/kensodemann/world-of-teas/issues/51)) ([bec9906](https://github.com/kensodemann/world-of-teas/commit/bec9906))
* **database:** create scripts to create initial user (special use) ([#61](https://github.com/kensodemann/world-of-teas/issues/61)) ([0a20d98](https://github.com/kensodemann/world-of-teas/commit/0a20d98))
* **database:** create the user related tables ([#44](https://github.com/kensodemann/world-of-teas/issues/44)) ([739a07d](https://github.com/kensodemann/world-of-teas/commit/739a07d))
* **header:** beef up the testing ([#26](https://github.com/kensodemann/world-of-teas/issues/26)) ([cfb0add](https://github.com/kensodemann/world-of-teas/commit/cfb0add))
* **header:** highlight the current route ([#25](https://github.com/kensodemann/world-of-teas/issues/25)) ([286ee1c](https://github.com/kensodemann/world-of-teas/commit/286ee1c)), closes [#23](https://github.com/kensodemann/world-of-teas/issues/23)
* **http:** add the bearer token to outgoing requests ([#73](https://github.com/kensodemann/world-of-teas/issues/73)) ([ff62eb8](https://github.com/kensodemann/world-of-teas/commit/ff62eb8)), closes [#69](https://github.com/kensodemann/world-of-teas/issues/69)
* **login:** create the login screen ([#65](https://github.com/kensodemann/world-of-teas/issues/65)) ([ab29065](https://github.com/kensodemann/world-of-teas/commit/ab29065))
* **password:** create the password endpoint ([#58](https://github.com/kensodemann/world-of-teas/issues/58)) ([72ae47f](https://github.com/kensodemann/world-of-teas/commit/72ae47f))
* **server:** add user service ([#46](https://github.com/kensodemann/world-of-teas/issues/46)) ([edf7bc0](https://github.com/kensodemann/world-of-teas/commit/edf7bc0))
* **server:** add users endpoint ([#54](https://github.com/kensodemann/world-of-teas/issues/54)) ([e3ffd10](https://github.com/kensodemann/world-of-teas/commit/e3ffd10)), closes [#29](https://github.com/kensodemann/world-of-teas/issues/29)
* **users:** create initial password with new users ([#60](https://github.com/kensodemann/world-of-teas/issues/60)) ([f805b31](https://github.com/kensodemann/world-of-teas/commit/f805b31))



<a name="0.0.1-2"></a>
## [0.0.1-2](https://github.com/kensodemann/world-of-teas/compare/v0.0.1-1...v0.0.1-2) (2017-11-26)


### Features

* **footer:** style the footer ([#22](https://github.com/kensodemann/world-of-teas/issues/22)) ([287adaf](https://github.com/kensodemann/world-of-teas/commit/287adaf)), closes [#9](https://github.com/kensodemann/world-of-teas/issues/9)
* **header:** layout and style the header ([#24](https://github.com/kensodemann/world-of-teas/issues/24)) ([f32c68d](https://github.com/kensodemann/world-of-teas/commit/f32c68d)), closes [#10](https://github.com/kensodemann/world-of-teas/issues/10) [#11](https://github.com/kensodemann/world-of-teas/issues/11)



<a name="0.0.1-1"></a>
## [0.0.1-1](https://github.com/kensodemann/world-of-teas/compare/e3ad3b7...v0.0.1-1) (2017-11-25)


### Bug Fixes

* **doc:** update database script readme with production instructions ([aa91fff](https://github.com/kensodemann/world-of-teas/commit/aa91fff))
* **main:** use proper fake test data service ([5f2766c](https://github.com/kensodemann/world-of-teas/commit/5f2766c))
* **tests:** update the web unit tests for the new structure ([#3](https://github.com/kensodemann/world-of-teas/issues/3)) ([e8dc7a0](https://github.com/kensodemann/world-of-teas/commit/e8dc7a0))


### Features

* **api:** add a tea-categories service ([#6](https://github.com/kensodemann/world-of-teas/issues/6)) ([d899f06](https://github.com/kensodemann/world-of-teas/commit/d899f06))
* **categories:** display the existing categories ([#7](https://github.com/kensodemann/world-of-teas/issues/7)) ([718394a](https://github.com/kensodemann/world-of-teas/commit/718394a))
* **database:** add data update scripts ([9eb3ce5](https://github.com/kensodemann/world-of-teas/commit/9eb3ce5))
* **e2e:** add e2e tests ([#4](https://github.com/kensodemann/world-of-teas/issues/4)) ([0ac757c](https://github.com/kensodemann/world-of-teas/commit/0ac757c))
* **footer:** include version information ([#21](https://github.com/kensodemann/world-of-teas/issues/21)) ([a17bd0c](https://github.com/kensodemann/world-of-teas/commit/a17bd0c))
* **footer:** Layout the footer data ([#19](https://github.com/kensodemann/world-of-teas/issues/19)) ([f3fb6c8](https://github.com/kensodemann/world-of-teas/commit/f3fb6c8)), closes [#8](https://github.com/kensodemann/world-of-teas/issues/8)
* **testing:** add unit tests for the server side code ([#2](https://github.com/kensodemann/world-of-teas/issues/2)) ([e3ad3b7](https://github.com/kensodemann/world-of-teas/commit/e3ad3b7))
* **web:** create the basic web layout with navigation ([c86f31f](https://github.com/kensodemann/world-of-teas/commit/c86f31f))



