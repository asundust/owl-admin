<?php

namespace Slowlyo\OwlAdmin\Renderers;

/**
 * @method self label($value) 
 * @method self icon($value) 
 * @method self iconClassName($value) 
 * @method self disabled($value) 
 * @method self key($value)  可选值: ROTATE_RIGHT | ROTATE_LEFT | ZOOM_IN | ZOOM_OUT | SCALE_ORIGIN | 
 */
class ImageToolbarAction extends BaseRenderer
{
    public string $key = 'ROTATE_RIGHT';
}
