<template>
    <div id="txt_container">
        <div>
            <p>感谢参与！</p >
        </div>
    </div>
    <div style="position: absolute; top: 70%; right:30%; width:50%; height:10%;">
        <div class="firework" style="left: 50%; top: 50%;"></div>
        <div class="firework" style="left: 40%; top: 40%; background-color: #00ff00;"></div>
        <div class="firework" style="left: 60%; top: 60%; background-color: #0000ff;"></div>
        <div class="firework" style="left: 30%; top: 70%; background-color: #ffff00;"></div>
        <div class="firework" style="left: 70%; top: 40%; background-color: #ff00ff;"></div>
        <div class="firework" style="left: 80%; top: 20%; background-color: #00fffb;"></div>
        <div class="firework" style="left: 90%; top: 10%; background-color: rgb(154, 239, 8);"></div>
        <div class="firework" style="left: 70%; top: 0%; background-color: #483b9c;"></div>
    </div>
</template>
  
<script>

</script>
  
<style>
#txt_container {
  text-align: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: noname 5s forwards;
}


@keyframes noname {
    0% {
        transform: translateY(0) scale(1);
    }

    100% {
        transform: translateY(-200px) scale(1.5);
    }
}


.firework {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #ff0000;
    /* 初始颜色，可根据需要修改 */
    animation: fireworks 4s ease forwards;
}

@keyframes fireworks {
    0% {
        opacity: 1;
        transform: translateY(0) scale(0);
    }

    100% {
        opacity: 0;
        transform: translateY(-300px) scale(2);
    }
}
  </style>