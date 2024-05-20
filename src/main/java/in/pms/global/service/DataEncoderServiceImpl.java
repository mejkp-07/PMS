package in.pms.global.service;

import org.springframework.stereotype.Service;

@Service
public class DataEncoderServiceImpl implements DataEncoderService
{
  public DataEncoderServiceImpl()
  {
  
  }
  public  String encode(String strString_p)
	{
		if(strString_p==null)
			strString_p="";
		else
		{
			try
			{
				strString_p = (new sun.misc.BASE64Encoder()).encode(strString_p.getBytes());
			}

			catch(Exception e){}

		}
		return strString_p;
	}

   public  String decode(String strString_p)
   {
	if(strString_p==null)
		strString_p="";
	else
	{
	   try
       {
		 strString_p = new String((new sun.misc.BASE64Decoder()).decodeBuffer(strString_p));
       }
			catch(Exception e){}
		}
		return strString_p;
	}
  
   public static  String decodeNew(String strString_p)
   {
	if(strString_p==null)
		strString_p="";
	else
	{
	   try
       {
		 strString_p = new String((new sun.misc.BASE64Decoder()).decodeBuffer(strString_p));
       }
			catch(Exception e){}
		}
		return strString_p;
	}
}