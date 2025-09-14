<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustHosts as Middleware;

class TrustHosts extends Middleware
{
    /**
     * Get the host patterns that should be trusted.
     *
     * @return array<int, string|null>
     */
    public function hosts()
    {
        return [
            $this->allSubdomainsOfApplicationUrl(),
        ];
    }
}
