"""
语音识别核心模块
支持中英文语音转文字
使用SpeechRecognition库
"""

import os
import threading
import queue
import tempfile
import wave
import numpy as np
import pyaudio
import speech_recognition as sr
from typing import Optional, Callable


class SpeechRecognizer:
    """语音识别器"""
    
    def __init__(self):
        """初始化语音识别器"""
        self.recognizer = sr.Recognizer()
        self.microphone = None
        self.is_recording = False
        self.recording_thread = None
        self.callback = None
        
        # 音频参数
        self.sample_rate = 16000
        self.channels = 1
        self.chunk_size = 1024
        
        self._init_microphone()
    
    def _init_microphone(self):
        """初始化麦克风"""
        try:
            self.microphone = sr.Microphone()
            # 调整环境噪音
            with self.microphone as source:
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
            print("麦克风初始化成功")
        except Exception as e:
            print(f"麦克风初始化失败: {e}")
    
    def set_callback(self, callback: Callable[[str], None]):
        """设置识别结果回调函数"""
        self.callback = callback
    
    def start_recording(self):
        """开始录音识别"""
        if self.is_recording:
            return
        
        if not self.microphone:
            print("麦克风未初始化，无法开始识别")
            return
        
        self.is_recording = True
        self.recording_thread = threading.Thread(target=self._record_audio)
        self.recording_thread.daemon = True
        self.recording_thread.start()
        print("开始录音识别...")
    
    def stop_recording(self):
        """停止录音识别"""
        self.is_recording = False
        if self.recording_thread:
            self.recording_thread.join()
        print("停止录音识别")
    
    def _record_audio(self):
        """录音线程"""
        try:
            while self.is_recording:
                try:
                    with self.microphone as source:
                        print("正在监听...")
                        audio = self.recognizer.listen(source, timeout=1, phrase_time_limit=10)
                        
                        if not self.is_recording:
                            break
                        
                        # 识别音频
                        self._recognize_audio(audio)
                        
                except sr.WaitTimeoutError:
                    continue
                except sr.UnknownValueError:
                    print("无法识别语音")
                except Exception as e:
                    print(f"录音错误: {e}")
                    break
                    
        except Exception as e:
            print(f"录音线程错误: {e}")
    
    def _recognize_audio(self, audio):
        """识别音频"""
        try:
            # 尝试中文识别
            text = self.recognizer.recognize_google(audio, language='zh-CN')
            if text and self.callback:
                self.callback(text)
                return
            
        except sr.UnknownValueError:
            pass
        except sr.RequestError:
            pass
        
        try:
            # 尝试英文识别
            text = self.recognizer.recognize_google(audio, language='en-US')
            if text and self.callback:
                self.callback(text)
                return
                
        except sr.UnknownValueError:
            pass
        except sr.RequestError as e:
            print(f"识别服务错误: {e}")
    
    def recognize_file(self, audio_file: str) -> str:
        """
        识别音频文件
        
        Args:
            audio_file: 音频文件路径
            
        Returns:
            识别结果文本
        """
        try:
            with sr.AudioFile(audio_file) as source:
                audio = self.recognizer.record(source)
                
                # 尝试中文识别
                try:
                    text = self.recognizer.recognize_google(audio, language='zh-CN')
                    if text:
                        return text
                except sr.UnknownValueError:
                    pass
                except sr.RequestError:
                    pass
                
                # 尝试英文识别
                try:
                    text = self.recognizer.recognize_google(audio, language='en-US')
                    if text:
                        return text
                except sr.UnknownValueError:
                    return "无法识别音频内容"
                except sr.RequestError as e:
                    return f"识别服务错误: {e}"
                    
        except Exception as e:
            return f"文件识别失败: {e}"
    
    def recognize_microphone_once(self) -> str:
        """
        一次性麦克风识别
        
        Returns:
            识别结果文本
        """
        try:
            with self.microphone as source:
                print("请说话...")
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
                
                # 尝试中文识别
                try:
                    text = self.recognizer.recognize_google(audio, language='zh-CN')
                    if text:
                        return text
                except sr.UnknownValueError:
                    pass
                except sr.RequestError:
                    pass
                
                # 尝试英文识别
                try:
                    text = self.recognizer.recognize_google(audio, language='en-US')
                    if text:
                        return text
                except sr.UnknownValueError:
                    return "无法识别语音"
                except sr.RequestError as e:
                    return f"识别服务错误: {e}"
                    
        except Exception as e:
            return f"识别失败: {e}"


def test_microphone():
    """测试麦克风功能"""
    recognizer = SpeechRecognizer()
    
    def on_result(text):
        print(f"识别结果: {text}")
    
    recognizer.set_callback(on_result)
    recognizer.start_recording()
    
    try:
        input("按回车键停止录音...")
    finally:
        recognizer.stop_recording()


if __name__ == "__main__":
    # 测试代码
    test_microphone() 