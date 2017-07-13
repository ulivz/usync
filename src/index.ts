/// <reference path="./index.d.ts" />

/**
 * @license
 * Copyright toxichl All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import Usync from './core';
import initGlobalAPI from './globalAPI'

initGlobalAPI(Usync);

module.exports = Usync;

