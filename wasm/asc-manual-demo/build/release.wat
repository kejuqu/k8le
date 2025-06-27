(module
 (type $0 (func (param f64 f64) (result f64)))
 (type $1 (func (param f64) (result f64)))
 (global $~lib/memory/__data_end i32 (i32.const 8))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 32776))
 (global $~lib/memory/__heap_base i32 (i32.const 32776))
 (memory $0 0)
 (table $0 1 1 funcref)
 (elem $0 (i32.const 1))
 (export "add" (func $assembly/index/add))
 (export "sub" (func $assembly/index/sub))
 (export "fib" (func $assembly/index/fib))
 (export "memory" (memory $0))
 (func $assembly/index/add (param $0 f64) (param $1 f64) (result f64)
  (local $2 f64)
  (local $3 f64)
  f64.const 0
  local.set $2
  f64.const 0
  local.set $3
  loop $for-loop|0
   local.get $3
   f64.const 1e8
   f64.lt
   if
    local.get $2
    local.get $0
    f64.add
    local.set $2
    local.get $3
    f64.const 1
    f64.add
    local.set $3
    br $for-loop|0
   end
  end
  local.get $2
  local.get $1
  f64.add
  return
 )
 (func $assembly/index/sub (param $0 f64) (param $1 f64) (result f64)
  local.get $0
  local.get $1
  f64.sub
  return
 )
 (func $assembly/index/fib (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 f64)
  (local $3 f64)
  (local $4 f64)
  local.get $0
  f64.const 0
  f64.le
  if
   f64.const 0
   return
  end
  local.get $0
  f64.const 1
  f64.eq
  if (result i32)
   i32.const 1
  else
   local.get $0
   f64.const 2
   f64.eq
  end
  if
   f64.const 1
   return
  end
  f64.const 1
  local.set $1
  f64.const 1
  local.set $2
  f64.const 3
  local.set $3
  loop $for-loop|0
   local.get $3
   local.get $0
   f64.le
   if
    local.get $1
    local.get $2
    f64.add
    local.set $4
    local.get $2
    local.set $1
    local.get $4
    local.set $2
    local.get $3
    f64.const 1
    f64.add
    local.set $3
    br $for-loop|0
   end
  end
  local.get $2
  return
 )
)
